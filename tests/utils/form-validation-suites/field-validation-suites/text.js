const required = require('./required');
const maxLength = require('./maxLength');

const text = (fieldName, getDispute, isRequired = true, length = 128) => {
  required(fieldName, getDispute, isRequired);

  maxLength(fieldName, length, getDispute);
};

text.medium = (fieldName, getDispute, isRequired = true) =>
  text(fieldName, getDispute, isRequired, 152);
text.long = (fieldName, getDispute, isRequired = true) =>
  text(fieldName, getDispute, isRequired, 256);

module.exports = text;
