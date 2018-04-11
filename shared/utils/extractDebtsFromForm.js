/**
 * Extracts the form-data version of debt information and returns a list of tuples of type -> amount
 * @param {{[key: string]: string[]}} formDebts The debts as they are saved into the form data
 */
module.exports = formDebts =>
  Object.keys(formDebts).reduce(
    (acc, type) => [...acc, ...formDebts[type].map(amount => ({ type, amount }))],
    [],
  );
