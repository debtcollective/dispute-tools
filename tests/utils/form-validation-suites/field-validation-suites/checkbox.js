const oneOf = require('./oneOf');

module.exports = (fieldName, getDispute) => {
  oneOf(fieldName, getDispute, ['on', 'off'], ['true', true, 'false', false, 'yes', 'no']);
};
