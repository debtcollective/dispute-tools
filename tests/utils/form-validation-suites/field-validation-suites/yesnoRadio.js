const required = require('./required');
const oneOf = require('./oneOf');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);
  oneOf(fieldName, getDispute, ['yes', 'no'], ['true', true, 'false', false]);
};
