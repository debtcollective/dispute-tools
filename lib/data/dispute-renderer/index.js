/* eslint-disable camelcase */
const path = require('path');

const { wageGarnishmentDocument: wage_garnishment } = require(path.join(
  __dirname,
  '../dispute-tools/constants.js',
));

const {
  atb_disqualifying,
  ability_to_benefit,
  unauthorized_signature_form,
} = require('../../../services/renderers/tool-configurations/shared');

module.exports = {
  '11111111-1111-1111-1111-111111111111': {
    A: {
      documents: { wage_garnishment },
    },
    B: {
      documents: { wage_garnishment },
    },
    C: {
      documents: { wage_garnishment, ability_to_benefit },
    },
    D: {
      documents: { wage_garnishment, atb_disqualifying },
    },
    E: {
      documents: { wage_garnishment, unauthorized_signature_form },
    },
  },
};
