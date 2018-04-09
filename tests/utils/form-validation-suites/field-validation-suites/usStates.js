const { expectRule, performTest } = require('../helpers');
const required = require('./required');
const { US_STATES } = require('../../../../lib/data/form-definitions/validations');

const expectOneOf = expectRule('oneOf');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  US_STATES.forEach(state => {
    it(`should accept ${state}`, performTest(getDispute, fieldName, state, expectOneOf, true));
  });

  it('should not allow bogus', performTest(getDispute, fieldName, 'bogus flogus', expectOneOf));
};
