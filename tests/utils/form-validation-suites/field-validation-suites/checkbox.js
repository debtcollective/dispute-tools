const oneOf = require('./oneOf');

module.exports = (fieldName, getDispute) => {
  oneOf(fieldName, getDispute, ['yes', 'no'], ['true', true, 'false', false]);
};
