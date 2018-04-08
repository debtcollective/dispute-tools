/* globals logger */

const _ = require('lodash');
const Field = require('../lib/data/form-definitions/validations');
const { InvalidValidationCacheConfiguration } = require('../lib/errors');

const flattenFieldSet = fieldSet =>
  _.uniqBy(
    _.flattenDeep([
      fieldSet,
      fieldSet.fields.map(rowFields =>
        rowFields.map(
          field => (Array.isArray(field.fields) ? [field, flattenFieldSet(field)] : field),
        ),
      ),
    ]).filter(f => f instanceof Field && f.validations !== undefined && f.type !== 'mountable'),
    'name',
  );

const extractToolFormValidations = tool =>
  _.map(tool.options, (option, optionName) => {
    const form = option.steps.find(s => s.type === 'form');

    const fields = _.flattenDeep(form.fieldSets.map(flattenFieldSet)).reduce(
      (acc, { name, validations }) => ({ ...acc, [name]: validations }),
      {},
    );

    return {
      name: form.name,
      optionName,
      fields,
    };
  });

const foldToOptionFieldsValidationsObject = validations =>
  validations.reduce((acc, { optionName, fields }) => ({ ...acc, [optionName]: fields }), {});

const cachedConfigs = {};

const getCheckitConfig = dispute => {
  const cached = _.get(cachedConfigs, `${dispute.disputeTool.slug}.${dispute.data.option}`);
  if (cached) return cached;

  throw new InvalidValidationCacheConfiguration(dispute.disputeTool.slug, dispute.data.option);
};

const basePath = '../lib/data/form-definitions';

logger.info('Caching form validation configurations');

[
  'credit-report-dispute',
  'general-debt-dispute',
  'private-student-loan-dispute',
  'tax-offset-dispute',
  'wage-garnishment-dispute',
].forEach(slug => {
  cachedConfigs[slug] = foldToOptionFieldsValidationsObject(
    extractToolFormValidations(require(`${basePath}/${slug}`)),
  );
});

module.exports = {
  extractToolFormValidations,
  getCheckitConfig,
  foldToOptionFieldsValidationsObject,
};
