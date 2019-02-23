const _ = require('lodash');
const Checkit = require('checkit');
const moment = require('moment');

const getOptions = (options, caseSensitive) => {
  if (caseSensitive !== 'false') {
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

Checkit.Validator.prototype.oneOf = function oneOf(value, options, _caseSensitive) {
  const caseSensitive = _caseSensitive !== 'false';
  const normalizedOptions = getOptions(options);

  if (_.isEmpty(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return _.every(value, option => isValidOption(option, normalizedOptions, caseSensitive));
  }

  return isValidOption(value, normalizedOptions, caseSensitive);
};

Checkit.Validator.prototype.parsableDate = function parsableDate(val) {
  return moment(val, 'MM/DD/YYYY').isValid() || moment(val, 'YYYY/MM/DD').isValid();
};

module.exports = class extends Checkit {
  constructor(...args) {
    super(...args);
    this.messages.ssn = 'Invalid social security number';
    this.messages.oneOf = 'Invalid option. The value of {{label}} was not one of {{var_1}}';
    this.messages.parsableDate = 'Invalid date format. The typical date format is MM/DD/YYYY';
  }
};
