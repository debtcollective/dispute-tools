const DisputeTool = require('../../models/DisputeTool');

const { createUser, createDispute } = require('../utils');
const {
  currency,
  text,
  usStates,
  zip,
} = require('../utils/form-validation-suites/field-validation-suites');

describe('general debt dispute form validation', () => {
  let dispute;
  const getDispute = () => dispute;

  before(async () => {
    dispute = await createDispute(
      await createUser(),
      await DisputeTool.findById('11111111-1111-3333-1111-111111111111'),
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

  describe('agency-name', () => {
    text('agency-name', getDispute, true);
  });

  describe('agency-address', () => {
    text('agency-address', getDispute, true);
  });

  describe('agency-city', () => {
    text('agency-city', getDispute, true);
  });

  describe('agency-state', () => {
    usStates('agency-state', getDispute, true);
  });

  describe('agency-zip', () => {
    zip('agency-zip-code', getDispute, true);
  });
});
