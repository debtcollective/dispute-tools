const _ = require('lodash');
const Field = require('../validations');

const { currency } = Field.FieldValidation;

const debtTypes = Object.freeze({
  federalStudentLoanDebt: 'Federal student loan debt',
  privateStudentLoanDebt: 'Private student loan debt',
  medicalDebt: 'Medical debt',
  creditCardDebt: 'Credit card debt',
  autoLoanDebt: 'Auto loan debt',
  paydayLoanDebt: 'Payday loan debt',
});

module.exports = {
  title: 'Debt Amounts',
  subtitle:
    'To help us better understand the types of debt you and our members our fighting, please provide us with the amounts of debt collectors are currently claiming you owe. If the type of debt is not available, feel free to choose "Other" and ....',
  fields: new Field({
    type: 'keyvalue',
    keys: _.values(debtTypes),
    valueType: 'number',
    validations: currency,
  }).fields,
};
