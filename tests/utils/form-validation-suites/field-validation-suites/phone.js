const required = require('./required');
const maxLength = require('./maxLength');
const minLength = require('./minLength');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  maxLength(fieldName, 14, getDispute);
  minLength(fieldName, 9, getDispute);
};
