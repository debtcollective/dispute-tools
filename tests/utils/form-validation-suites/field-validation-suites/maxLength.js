const { expectRule, performTest } = require('../helpers');

const expectMaxLength = expectRule('maxLength');

module.exports = (fieldName, length, getDispute) => {
  describe('maxLength', () => {
    it(
      `should allow less than ${length} characters`,
      performTest(getDispute, fieldName, new Array(length - 1).fill('a'), expectMaxLength, true),
    );

    it(
      `should not allow more than ${length} characters`,
      performTest(getDispute, fieldName, new Array(length + 1).fill('a'), expectMaxLength),
    );

    it(
      `should allow ${length} characters`,
      performTest(getDispute, fieldName, new Array(length).fill('a'), expectMaxLength, true),
    );
  });
};
