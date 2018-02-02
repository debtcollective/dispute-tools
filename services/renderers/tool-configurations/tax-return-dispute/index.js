/* eslint-disable camelcase */
const tax_offset_review = require('./tax-offset-review');
const { configure } = require('../shared/federal-student-loan-disputes');

module.exports = configure(
  '11111111-1111-2222-1111-111111111111',
  tax_offset_review,
);
