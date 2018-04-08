const _ = require('lodash');
const Checkit = require('checkit');

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

module.exports = class extends Checkit {
  constructor(...args) {
    super(...args);
    this.messages.ssn = 'Invalid social security number';
    this.messages.oneOf = 'Invalid option. Was not one of {{var_1}}';
  }
};
