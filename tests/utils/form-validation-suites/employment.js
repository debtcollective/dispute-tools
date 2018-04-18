const { setBaseFormData, setExpectNoErrors } = require('./helpers');
const required = require('./field-validation-suites/required');
const text = require('./field-validation-suites/text');
const zip = require('./field-validation-suites/zip');
const phone = require('./field-validation-suites/phone');
const date = require('./field-validation-suites/date');
const usStates = require('./field-validation-suites/usStates');

module.exports = getDispute => {
  describe('employment-radio-option', () => {
    required('employment-radio-option', getDispute, true);

    describe('when yes', () => {
      before(() => {
        setBaseFormData({ 'employment-radio-option': 'yes' });
      });

      after(() => {
        setBaseFormData({});
      });

      describe('employer', () => {
        text('employer', getDispute, true);
      });

      describe('employmentDate', () => {
        date('employmentDate', getDispute, true);
      });

      describe('employerAddress1', () => {
        text('employerAddress1', getDispute, true);
      });

      describe('employerCity', () => {
        text('employerCity', getDispute, true);
      });

      describe('employerState', () => {
        usStates('employerState', getDispute, true);
      });

      describe('employerZipCode', () => {
        zip('employerZipCode', getDispute, true);
      });

      describe('employerPhone', () => {
        phone('employerPhone', getDispute, true);
      });
    });

    describe('when no', () => {
      before(() => {
        setBaseFormData({ 'employment-radio-option': 'no' });
        setExpectNoErrors(true);
      });

      after(() => {
        setBaseFormData({});
        setExpectNoErrors(false);
      });

      describe('employer', () => {
        text('employer', getDispute, false);
      });

      describe('employmentDate', () => {
        date('employmentDate', getDispute, false);
      });

      describe('employerAddress1', () => {
        text('employerAddress1', getDispute, false);
      });

      describe('employerCity', () => {
        text('employerCity', getDispute, false);
      });

      describe('employerState', () => {
        usStates('employerState', getDispute, false);
      });

      describe('employerZipCode', () => {
        zip('employerZipCode', getDispute, false);
      });

      describe('employerPhone', () => {
        phone('employerPhone', getDispute, false);
      });
    });
  });
};
