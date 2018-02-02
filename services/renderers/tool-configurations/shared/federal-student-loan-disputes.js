// Stuff that both the wage garnishment and tax return disputes use
const {
  atb_disqualifying,
  ability_to_benefit,
  unauthorized_signature_form,
} = require('../shared');

// functions
const configure = (disputeToolId, dispute) => {
  const configuration = {};
  configuration[disputeToolId] = {
    A: { dispute },
    B: { dispute },
    C: { dispute, ability_to_benefit },
    D: { dispute, atb_disqualifying },
    E: { dispute, unauthorized_signature_form },
  };
  return configuration;
};

const checkboxKey = n => `Check Box${n}`;

// constants
const requestAdditionalFacts =
  'I am requesting an in-person or telephone hearing because there are additional facts that I believe can only be described in person or by phone.';

// "enums"
const DisputeProcess = {
  WRITTEN: 1,
  INPERSON: 2,
  BYPHONE: 3,
};

const CheckboxAnswer = {
  YES: 'Yes',
  NO: 'Off',
};

module.exports = {
  configure,
  requestAdditionalFacts,
  DisputeProcess,
  CheckboxAnswer,
  checkboxKey,
};
