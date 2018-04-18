const { expectRule, performTest } = require('../helpers');
const required = require('./required');
const num = require('./number');

const expectGreaterThan = expectRule('greaterThan');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  num(fieldName, getDispute, true);

  it('should not be less than 0', performTest(getDispute, fieldName, -1, expectGreaterThan));
  it('should allow greater than 0', performTest(getDispute, fieldName, 1, expectGreaterThan, true));
};
