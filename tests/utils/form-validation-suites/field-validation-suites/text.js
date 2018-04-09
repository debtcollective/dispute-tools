const { performTest, expectRule } = require('../helpers');
const required = require('./required');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  it(
    'should not be allowed to exceed 128 characters',
    performTest(getDispute, fieldName, new Array(129).fill('a').join(''), expectRule('maxLength')),
  );
};
