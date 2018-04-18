const DisputeTool = require('../../models/DisputeTool');

const { createUser, createDispute } = require('../utils');
const {
  currency,
  text,
  email,
  phone,
  required,
  usStates,
  zip,
  date,
  ssn,
  oneOf,
} = require('../utils/form-validation-suites/field-validation-suites');

describe('credit report dispute form validation', () => {
  let dispute;
  const getDispute = () => dispute;

  before(async () => {
    dispute = await createDispute(
      await createUser(),
      await DisputeTool.findById('11111111-1111-4444-1111-111111111111'),
    );
    dispute.data.option = 'none';
  });

  describe('debt-type', () => {
    text('debt-type', getDispute, true);
  });

  describe('debt-amount', () => {
    currency('debt-amount', getDispute, true);
  });

  describe('name', () => {
    text('name', getDispute, true);
  });

  describe('ssn', () => {
    ssn('ssn', getDispute, true);
  });

  describe('dob', () => {
    date('dob', getDispute, true);
  });

  describe('address', () => {
    text('address', getDispute, true);
  });

  describe('city', () => {
    text('city', getDispute, true);
  });

  describe('state', () => {
    usStates('state', getDispute, true);
  });

  describe('zip-code', () => {
    zip('zip-code', getDispute, true);
  });

  describe('email', () => {
    email('email', getDispute, true);
  });

  describe('phone', () => {
    phone('phone', getDispute, true);
  });

  describe('agencies', () => {
    required('agencies', getDispute, true);
    oneOf('agencies', getDispute, ['Experian', 'Equifax', 'TransUnion']);
  });
});
