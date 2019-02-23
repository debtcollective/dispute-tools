/* global logger */
const _ = require('lodash');
// use relative path here until babel plugin for module aliasing is added
const Field = require('../lib/data/form-definitions/validations');
const { InvalidValidationCacheConfiguration } = require('../lib/errors');

logger = logger || console;

const flattenFieldSet = fieldSet =>
  _.uniqBy(
    _.flattenDeep([
      fieldSet,
      fieldSet.fields.map(rowFields =>
        rowFields.map(
          field => (Array.isArray(field.fields) ? [field, flattenFieldSet(field)] : field),
        ),
      ),
    ]).filter(
      f =>
        f instanceof Field &&
        f.validations !== undefined &&
        f.type !== 'mountable' &&
        f.name &&
        f.name !== 'undefined',
    ),
    'name',
  );

const extractToolFormValidations = tool =>
  _.map(tool.options, (option, optionName) => {
    const form = _.find(option.steps, s => s.type === 'form');

    const { fields, nameLabels, customSelectors } = _.flattenDeep(
      form.fieldSets.map(flattenFieldSet),
    ).reduce(
      ({ fields, nameLabels, customSelectors }, { name, validations, label, customSelector }) => ({
        fields: {
          ...fields,
          [name]: validations,
        },
        nameLabels: {
          ...nameLabels,
          [name]: label,
        },
        customSelectors: {
          ...customSelectors,
          [name]: customSelector,
        },
      }),
      { fields: {}, nameLabels: {}, customSelectors: {} },
    );

    return {
      name: form.name,
      optionName,
      fields,
      nameLabels,
      customSelectors,
    };
  });

const foldToOptionFieldsValidationsObject = validations =>
  validations.reduce((acc, { optionName, fields }) => ({ ...acc, [optionName]: fields }), {});

const foldToOptionNameCustomSelectorsObject = validations =>
  validations.reduce(
    (acc, { optionName, customSelectors }) => ({ ...acc, [optionName]: customSelectors }),
    {},
  );

const foldToOptionNameLabelsObject = validations =>
  validations.reduce(
    (acc, { optionName, nameLabels }) => ({ ...acc, [optionName]: nameLabels }),
    {},
  );

const cachedConfigs = {};
const cachedNameToLabels = {};
const cachedCustomSelectors = {};

const getCheckitConfig = dispute => {
  const cached = _.get(cachedConfigs, `${dispute.disputeTool.slug}.${dispute.data.option}`);
  if (cached) return cached;

  throw new InvalidValidationCacheConfiguration(dispute.disputeTool.slug, dispute.data.option);
};

const getCustomSelector = (dispute, fieldName) => {
  const cached = _.get(cachedCustomSelectors, `${dispute.disputeTool.slug}.${dispute.data.option}`);
  if (cached) return cached[fieldName];

  throw new InvalidValidationCacheConfiguration(dispute.disputeTool.slug, dispute.data.option);
};

const makeErrorsReadable = (dispute, errors) => {
  const cached = _.get(cachedNameToLabels, `${dispute.disputeTool.slug}.${dispute.data.option}`);
  if (!cached) {
    throw new InvalidValidationCacheConfiguration(dispute.disputeTool.slug, dispute.data.option);
  }

  const res = _.reduce(
    errors,
    (errs, err, fieldName) => ({
      ...errs,
      [fieldName]: {
        ...err,
        message: err.message.replace(
          fieldName,
          `"${cached[fieldName] ? cached[fieldName].toLowerCase() : ''}" field`,
        ),
      },
    }),
    {},
  );
  return res;
};

logger.info('Caching form validation configurations');

[
  'credit-report-dispute',
  'general-debt-dispute',
  'private-student-loan-dispute',
  'tax-offset-dispute',
  'wage-garnishment-dispute',
].forEach(slug => {
  const validations = extractToolFormValidations(require(`../lib/data/form-definitions/${slug}`));

  cachedConfigs[slug] = foldToOptionFieldsValidationsObject(validations);
  cachedNameToLabels[slug] = foldToOptionNameLabelsObject(validations);
  cachedCustomSelectors[slug] = foldToOptionNameCustomSelectorsObject(validations);
});

const isNegative = answer => ['no', 'off', false, undefined].includes(answer);

const filterDependentFields = (form, constraints) => {
  const filteredFields = _.reduce(
    constraints,
    (filtered, validations, fieldName) => {
      const hasDependency = _.find(validations, e => e.indexOf('dependsOn') === 0);

      if (!hasDependency) {
        return {
          ...filtered,
          [fieldName]: validations,
        };
      }

      const dependsOn = _.last(hasDependency.split(':'));

      if (isNegative(form[dependsOn])) {
        return filtered;
      }

      return {
        ...filtered,
        [fieldName]: validations.filter(e => !(e.indexOf('dependsOn') === 0)),
      };
    },
    {},
  );

  return filteredFields;
};
module.exports = {
  extractToolFormValidations,
  getCheckitConfig,
  foldToOptionFieldsValidationsObject,
  filterDependentFields,
  makeErrorsReadable,
  getCustomSelector,
};
