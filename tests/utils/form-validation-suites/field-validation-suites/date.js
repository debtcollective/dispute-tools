const { expectRule, performTest } = require('../helpers');
const required = require('./required');

const expectParsableDate = expectRule('parsableDate');

module.exports = (fieldName, getDispute, isRequired = true) => {
  describe('date', () => {
    required(fieldName, getDispute, isRequired);

    [
      '05/16/1994',
      '02/29/2012',
      '01/01/1999',
      '01-01-1999',
      '01.03.2039',
      '03 03 03',
      '2020 03 01',
      '19 03 05',
      '2017/08/22',
      '2018',
    ].forEach(d => {
      it(`should accept ${d}`, performTest(getDispute, fieldName, d, expectParsableDate, true));
    });

    ['02/29/2009', 'asdf', '490as31'].forEach(d => {
      it(
        `should not accept ${d}`,
        performTest(getDispute, fieldName, d, expectParsableDate, false),
      );
    });
  });
};
