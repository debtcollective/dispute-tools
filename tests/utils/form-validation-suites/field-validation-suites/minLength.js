const { expectRule, performTest } = require('../helpers');

const expectMinLength = expectRule('minLength');

module.exports = (fieldName, length, getDispute) => {
  describe('minLength', () => {
    it(
      `should not allow less than ${length} characters`,
      performTest(getDispute, fieldName, new Array(length - 1).fill('a'), expectMinLength),
    );

    it(
      `should allow more than ${length} characters`,
      performTest(getDispute, fieldName, new Array(length + 1).fill('a'), expectMinLength, true),
    );

    it(
      `should allow ${length} characters`,
      performTest(getDispute, fieldName, new Array(length).fill('a'), expectMinLength, true),
    );
  });
};
