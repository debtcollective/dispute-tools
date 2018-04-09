const { setBaseFormData, setExpectNoErrors } = require('./helpers');
const required = require('./field-validation-suites/required');
const zip = require('./field-validation-suites/zip');
const text = require('./field-validation-suites/text');
const usStates = require('./field-validation-suites/usStates');

module.exports = getDispute => {
  describe('ffel-loan-radio-option', () => {
    required('ffel-loan-radio-option', getDispute, true);

    describe('when yes', () => {
      before(() => {
        setBaseFormData({ 'ffel-loan-radio-option': 'yes' });
      });

      after(() => {
        setBaseFormData({});
      });

      describe('guarantyAgency', () => {
        text('guarantyAgency', getDispute, true);
      });

      describe('guarantyAgencyMailingAddress', () => {
        text('guarantyAgencyMailingAddress', getDispute, true);
      });

      describe('guarantyAgencyCity', () => {
        text('guarantyAgencyCity', getDispute, true);
      });

      describe('guarantyAgencyState', () => {
        usStates('guarantyAgencyState', getDispute, true);
      });

      describe('guarantyAgencyZipCode', () => {
        zip('guarantyAgencyZipCode', getDispute, true);
      });
    });

    describe('when no', () => {
      before(() => {
        setBaseFormData({ 'ffel-loan-radio-option': 'no' });
        setExpectNoErrors(true);
      });

      after(() => {
        setBaseFormData({});
        setExpectNoErrors(false);
      });

      describe('guarantyAgency', () => {
        text('guarantyAgency', getDispute, false);
      });

      describe('guarantyAgencyMailingAddress', () => {
        text('guarantyAgencyMailingAddress', getDispute, false);
      });

      describe('guarantyAgencyCity', () => {
        text('guarantyAgencyCity', getDispute, false);
      });

      describe('guarantyAgencyState', () => {
        usStates('guarantyAgencyState', getDispute, false);
      });

      describe('guarantyAgencyZipCode', () => {
        zip('guarantyAgencyZipCode', getDispute, false);
      });
    });
  });
};
