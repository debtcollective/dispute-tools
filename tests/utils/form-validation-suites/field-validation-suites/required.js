const { expectRequired, performTest } = require('../helpers');

module.exports = (fieldName, getDispute, isRequired = true) => {
  describe('required validation', () => {
    if (isRequired) {
      it(
        'should not allow undefined',
        performTest(getDispute, fieldName, undefined, expectRequired),
      );
      it('should not allow null', performTest(getDispute, fieldName, null, expectRequired));
      it('should not allow empty string', performTest(getDispute, fieldName, '', expectRequired));
    } else {
      it(
        'should allow undefined',
        performTest(getDispute, fieldName, undefined, expectRequired, true),
      );
      it('should allow null', performTest(getDispute, fieldName, null, expectRequired, true));
      it('should allow empty string', performTest(getDispute, fieldName, '', expectRequired, true));
    }
  });
};
