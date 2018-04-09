const { expectNumber, performTest } = require('../helpers');

module.exports = (fieldName, getDispute, numeric = false) => {
  describe('number validation', () => {
    // Checkit numeric is broken for plain strings and boolean literals
    it(
      `should${numeric ? ' ' : ' not '}allow a plain string`,
      performTest(getDispute, fieldName, 'some string', expectNumber, numeric),
    );
    it(
      `should${numeric ? ' ' : ' not '}boolean true`,
      performTest(getDispute, fieldName, true, expectNumber, numeric),
    );
    it(
      `should${numeric ? ' ' : ' not '}boolean false`,
      performTest(getDispute, fieldName, false, expectNumber, numeric),
    );

    it(
      `should${numeric ? ' ' : ' not '}allow a parsable integer string`,
      performTest(getDispute, fieldName, '123', expectNumber, numeric),
    );

    it(
      `should${numeric ? ' ' : ' not '}allow a parsable decimal string`,
      performTest(getDispute, fieldName, '123.043', expectNumber, numeric),
    );

    it(
      `should${numeric ? ' ' : ' not '}allow a parsable string of 0`,
      performTest(getDispute, fieldName, '0', expectNumber, numeric),
    );

    it('should allow a 0', performTest(getDispute, fieldName, 0, expectNumber, true));

    it(
      'should allow a negative integer',
      performTest(getDispute, fieldName, -1, expectNumber, true),
    );

    it(
      'should allow a positive integer',
      performTest(getDispute, fieldName, 1, expectNumber, true),
    );

    it(
      'should allow a positive decimal',
      performTest(getDispute, fieldName, 0.0000123, expectNumber, true),
    );
    it(
      'should allow a negative decimal',
      performTest(getDispute, fieldName, -0.000123, expectNumber, true),
    );
  });
};
