const maxLength = require('./maxLength');
const minLength = require('./minLength');
const required = require('./required');
const num = require('./number');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  maxLength(fieldName, 5, getDispute);
  minLength(fieldName, 5, getDispute);
  num(fieldName, getDispute, true);
};
