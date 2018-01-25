const { isDate } = require('lodash');

exports.pathHelper = (subform = 0) => (page = 1) => (field, idx = 0) =>
  `topmostSubform[${subform}].Page${page}[0].${field}[${idx}]`;

exports.formatDate = d => {
  if (!isDate(d)) d = new Date(d);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

exports.normalizeSsn = ssn => {
  ssn = ssn.replace(/[-_ .]/g, '');
  return [ssn.substr(0, 3), ssn.substr(3, 2), ssn.substr(5, 4)];
};

exports.getAddress2 = ({
  form,
  address2 = 'address2',
  zipCode = 'zip-code',
  city = 'city',
  state = 'state',
  prefix = '',
}) =>
  form[prefix + address2] || // default to the old form style
  `${form[prefix + city]}, ${form[prefix + state]}, ${form[prefix + zipCode]}`;
