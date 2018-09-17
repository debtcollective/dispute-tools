const required = require('./required');
const { US_STATES } = require('$form-definitions/validations');

const oneOf = require('./oneOf');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  oneOf(fieldName, getDispute, US_STATES);
};
