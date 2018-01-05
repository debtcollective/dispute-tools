/* eslint-disable camelcase */
const tax_offset_review = require('./tax-offset-review');
const {
  atb_disqualifying,
  ability_to_benefit,
  unauthorized_signature_form,
} = require('../shared');

module.exports = {
  '11111111-1111-2222-1111-111111111111': {
    A: { tax_offset_review },
    B: { tax_offset_review },
    C: { tax_offset_review, ability_to_benefit },
    D: { tax_offset_review, atb_disqualifying },
    E: { tax_offset_review, unauthorized_signature_form },
  },
};
