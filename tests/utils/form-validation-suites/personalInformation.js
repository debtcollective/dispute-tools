const {
  date,
  phone,
  email,
  usStates,
  zip,
  ssn,
  text,
  currency,
} = require('./field-validation-suites');

/**
 * Builds the personal information form fields test suite for the passed
 * in dispute. Depends on the dispute's tool and data.option field having
 * been properly initialized
 * @param {Dispute} dispute Dispute setup with the correct option and tool
 */
module.exports = getDispute => {
  describe('debt-amount', () => {
    currency('debt-amount', getDispute);
  });

  describe('name', () => {
    text('name', getDispute);
  });

  describe('ssn', () => {
    ssn('ssn', getDispute);
  });

  describe('dob', () => {
    date('dob', getDispute);
  });

  describe('address1', () => {
    text('address1', getDispute);
  });

  describe('city', () => {
    text('city', getDispute);
  });

  describe('state', () => {
    usStates('state', getDispute);
  });

  describe('zip-code', () => {
    zip('zip-code', getDispute);
  });

  describe('email', () => {
    email('email', getDispute);
  });

  describe('phone', () => {
    phone('phone', getDispute);
  });

  describe('phone2', () => {
    phone('phone2', getDispute, false);
  });
};
