const { expectRule, performTest } = require('../helpers');

const expectAlphaDash = expectRule('alphaDash');

module.exports = (fieldName, getDispute) => {
  describe('alphaDash', () => {
    it(
      'should allow only letters',
      performTest(getDispute, fieldName, 'asdfbasdfasdvjiowejf', expectAlphaDash, true),
    );

    it(
      'should allow letters with dashes',
      performTest(getDispute, fieldName, 'asdf-asdf-asdf----asdfasdf', expectAlphaDash, true),
    );

    it('should allow numbers', performTest(getDispute, fieldName, 1234, expectAlphaDash, true));

    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ' ', '.', ',', '"', "'", '`', '—'].forEach(
      c => {
        it(`should not allow ${c}`, performTest(getDispute, fieldName, c, expectAlphaDash));
      },
    );

    ['-', '_'].forEach(c => {
      it(`should allow ${c}`, performTest(getDispute, fieldName, c, expectAlphaDash, true));
    });
  });
};
