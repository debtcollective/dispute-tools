const { isDate } = require('lodash');

exports.pathHelper = (subform = 0) => (page = 1) => (field, idx = 0) =>
  `topmostSubform[${subform}].Page${page}[0].${field}[${idx}]`;

/**
 * Formats the date for pug templates
 * @param {string} d date string
 * @returns {string} MM/DD/YYYY
 */
exports.formatDate = d => {
  if (!isDate(d)) d = new Date(d);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

/**
 * Strips non-numeric charactesr from the passed in string
 * returning a 3 length array of each section of the social
 * security number
 * @param {string} ssn Social security number string, should include 9 numbers
 * @return {number[]} The parsed SSN
 */
exports.normalizeSsn = ssn => {
  // Strip all non-numbered characters
  ssn = ssn.replace(/[^\d]/g, '');
  return [ssn.substr(0, 3), ssn.substr(3, 2), ssn.substr(5, 4)];
};

/**
 * Utility for extracting the address2 (city, state, zip) from
 * dispute form data. This is useful because it maintains the
 * old style extraction from when we used to collect the city, state
 * and zip all in one big string field
 * @param {any} form the form object from which to extract the data
 * @param {string} address2 the path to the address2 without prefix
 * @param {string} zipCode the path to the zip code without prefix
 * @param {string} city the path to the city without prefix
 * @param {string} state the path to the state without prefix
 * @param {string} prefix the prefix to prepend the other paths
 * @return {string} the formatted address2
 */
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
