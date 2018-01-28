const Checkit = require('checkit');

Checkit.Validator.prototype.ssn = function ssn(val) {
  const matched = val.toString().match(/[0-9]/g);
  return matched !== null && matched.length === 9;
};

module.exports = class extends Checkit {
  constructor(...args) {
    super(...args);
    this.messages.ssn = 'Invalid social security number';
  }
};
