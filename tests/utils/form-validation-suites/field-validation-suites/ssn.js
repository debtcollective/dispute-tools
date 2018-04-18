const required = require('./required');
const alphaDash = require('./alphaDash');
const minLength = require('./minLength');
const maxLength = require('./maxLength');
const { expectRule, performTest } = require('../helpers');

const expectSsn = expectRule('ssn');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  alphaDash(fieldName, getDispute);

  minLength(fieldName, 9, getDispute);
  maxLength(fieldName, 11, getDispute);

  it('should allow numbers', performTest(getDispute, fieldName, 123121234, expectSsn, true));
  it(
    'should allow string of numbers',
    performTest(getDispute, fieldName, '123121234', expectSsn, true),
  );
  it('should not allow letters', performTest(getDispute, fieldName, '123as1234', expectSsn));
  it('should allow dashes', performTest(getDispute, fieldName, '123-12-1234', expectSsn, true));
};
