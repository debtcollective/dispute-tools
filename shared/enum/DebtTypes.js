exports.DebtTypes = Object.freeze({
  federalStudentLoanDebt: 'Federal student loan debt',
  privateStudentLoanDebt: 'Private student loan debt',
  medicalDebt: 'Medical debt',
  creditCardDebt: 'Credit card debt',
  autoLoanDebt: 'Auto loan debt',
  paydayLoanDebt: 'Payday loan debt',
  housingDebt: 'Housing debt',
  finesAndFees: 'Fines and fees',
});

exports.DebtTypesCollection = Object.keys(exports.DebtTypes).reduce(
  (acc, key) => [
    ...acc,
    {
      key,
      value: exports.DebtTypes[key],
    },
  ],
  [],
);
