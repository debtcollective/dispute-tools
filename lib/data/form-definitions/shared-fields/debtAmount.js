const Field = require('../validations');

const { currency } = Field.FieldValidation;

// eslint-disable-next-line
const debtTypes = Object.freeze({
  federalStudentLoanDebt: 'Federal student loan debt',
  privateStudentLoanDebt: 'Private student loan debt',
  medicalDebt: 'Medical debt',
  creditCardDebt: 'Credit card debt',
  autoLoanDebt: 'Auto loan debt',
  paydayLoanDebt: 'Payday loan debt',
  housingDebt: 'Housing debt',
  finesAndFees: 'Fines and fees',
});

/* eslint-disable */
// module.exports = {
//   title: 'Debt Amounts',
//   subtitle:
//     'To help us better understand the types of debt you and our members our fighting, please provide us with the amounts of debt collectors are currently claiming you owe. If the type of debt is not available, feel free to choose "Other" and ....',
//   fields: new Field({
//     type: 'keyvalue',
//     keys: _.values(debtTypes),
//     valueType: 'number',
//     validations: currency,
//   }).fields,
// };
/* eslint-disable */

exports.field = new Field({
  name: 'debt-amount',
  label: 'Amount of debt being disputed',
  validations: currency,
});
