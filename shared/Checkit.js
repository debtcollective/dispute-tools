const _ = require('lodash');
const Checkit = require('checkit');
const moment = require('moment');

Checkit.Validator.prototype.ssn = function ssn(val) {
  const matched = val.toString().match(/[0-9]/g);
  return matched !== null && matched.length === 9;
};

// eslint-disable-next-line no-confusing-arrow
const getOptions = (options, caseSensitive) =>
  caseSensitive !== 'false'
    ? options.split(',').map(_.trim)
    : options
        .toLowerCase()
        .split(',')
        .map(_.trim);

Checkit.Validator.prototype.oneOf = function oneOf(val, options, caseSensitive) {
  return Array.isArray(val)
    ? _.every(val, v => Checkit.Validator.prototype.oneOf(v, options, caseSensitive))
    : getOptions(options, caseSensitive).includes(
        _.trim(caseSensitive !== 'false' ? val : val.toLowerCase()),
      );
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
