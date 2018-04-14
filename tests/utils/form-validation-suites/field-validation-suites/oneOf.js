const { performTest, expectRule } = require('../helpers');

const expectOneOf = expectRule('oneOf');

module.exports = (fieldName, getDispute, options, notAllowed = ['bogus flogus']) => {
  options.forEach(option => {
    it(
      `should accept ${typeof option} ${option}`,
      performTest(getDispute, fieldName, option, expectOneOf, true),
    );
  });

  notAllowed.forEach(option => {
    it(
      `should not allow ${typeof option} ${option}`,
      performTest(getDispute, fieldName, option, expectOneOf),
    );
  });
};
