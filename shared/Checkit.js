const _ = require('lodash');
const Checkit = require('checkit');
const moment = require('moment');

const getOptions = (options, caseSensitive) => {
  if (caseSensitive) {
    return options.split(',').map(_.trim);
  }

  return options
    .toLowerCase()
    .split(',')
    .map(_.trim);
};

const isValidOption = (option, options, caseSensitive) => {
  const optionToCompare = caseSensitive ? _.trim(option) : _.trim(option.toLowerCase());

  return options.includes(optionToCompare);
};

Checkit.Validator.prototype.ssn = function ssn(val) {
  const matched = val.toString().match(/[0-9]/g);
  return matched !== null && matched.length === 9;
};

Checkit.Validator.prototype.oneOf = function oneOf(value, options, ...flags) {
  const [_caseSensitive, _required] = flags;
  const caseSensitive = _.isEmpty(_caseSensitive) ? true : _caseSensitive === 'true';
  const required = _.isEmpty(_required) ? false : _required === 'required';

  const normalizedOptions = getOptions(options, caseSensitive);

  if (_.isEmpty(value)) {
    // When value is empty the field will be valid only if it's not required
    return !required;
  }

  if (Array.isArray(value)) {
    return _.every(value, option => isValidOption(option, normalizedOptions, caseSensitive));
  }

  return isValidOption(value, normalizedOptions, caseSensitive);
};

Checkit.Validator.prototype.parsableDate = function parsableDate(val) {
  return moment(val, 'MM/DD/YYYY').isValid() || moment(val, 'YYYY/MM/DD').isValid();
};

Checkit.Validator.prototype.arrayOf = function arrayOf(items, ...options) {
  let isValid = false;
  // Function intend the first parameter to the rule is a string to represent desire shape
  const stringifiedShape = `${options[0]}`;
  // Checkit uses : to separate parameters which lead us to use . instead
  const shape = JSON.parse(stringifiedShape.replace(/\./g, ':'));
  const shapeKeys = _.sortBy(Object.keys(shape));

  if (!_.isArray(items)) {
    return false;
  }

  items.every(item => {
    const itemKeys = _.sortBy(Object.keys(item));

    if (!_.isEqual(itemKeys, shapeKeys)) {
      isValid = false;
      return false;
    }

    itemKeys.every(itemKey => {
      isValid = typeof item[itemKey] === shape[itemKey];
      return isValid;
    });

    return isValid;
  });

  return isValid;
};

module.exports = class extends Checkit {
  constructor(...args) {
    super(...args);
    this.messages.ssn = 'Invalid social security number';
    this.messages.oneOf = 'Invalid option. The value of {{label}} was not one of {{var_1}}';
    this.messages.parsableDate = 'Invalid date format. The typical date format is MM/DD/YYYY';
    this.messages.arrayOf = 'Invalid shape given for an item in collection';
  }
};
