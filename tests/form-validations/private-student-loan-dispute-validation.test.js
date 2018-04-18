const DisputeTool = require('../../models/DisputeTool');

const { createUser, createDispute } = require('../utils');
const {
  currency,
  text,
  usStates,
  zip,
  date,
  yesnoRadio,
} = require('../utils/form-validation-suites/field-validation-suites');

describe('private student loan dispute form validation', () => {
  let dispute;
  const getDispute = () => dispute;

  before(async () => {
    dispute = await createDispute(
      await createUser(),
      await DisputeTool.findById('11111111-1111-6666-1111-111111111111'),
    );
    dispute.data.option = 'none';
  });

  describe('debt-amount', () => {
    currency('debt-amount', getDispute, true);
  });

  describe('name', () => {
    text('name', getDispute, true);
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

  describe('firm-name', () => {
    text.long('firm-name', getDispute, true);
  });

  describe('firm-address', () => {
    text('firm-address', getDispute, true);
  });

  describe('firm-city', () => {
    text('firm-city', getDispute, true);
  });

  describe('firm-state', () => {
    usStates('firm-state', getDispute, true);
  });

  describe('firm-zip', () => {
    zip('firm-zip-code', getDispute, true);
  });

  describe('account-number', () => {
    text('account-number', getDispute, true);
  });

  describe('last-correspondence-date', () => {
    date('last-correspondence-date', getDispute, true);
  });

  describe('is-debt-in-default', () => {
    yesnoRadio('is-debt-in-default', getDispute, true);
  });
});
