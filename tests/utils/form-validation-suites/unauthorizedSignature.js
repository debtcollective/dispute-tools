const { setBaseFormData, setExpectNoErrors } = require('./helpers');
const yesnoRadio = require('./field-validation-suites/yesnoRadio');
const text = require('./field-validation-suites/text');
const ssn = require('./field-validation-suites/ssn');
const checkbox = require('./field-validation-suites/checkbox');

module.exports = getDispute => {
  describe('fc-applying-as', () => {
    yesnoRadio('fc-applying-as', getDispute, true);

    describe('when yes', () => {
      before(() => setBaseFormData({ 'fc-applying-as': 'yes' }));
      after(() => setBaseFormData({}));

      describe('fc-student-name', () => {
        text('fc-student-name', getDispute, true);
      });

      describe('fc-student-ssn', () => {
        ssn('fc-student-ssn', getDispute, true);
      });
    });

    describe('when no', () => {
      before(() => {
        setBaseFormData({ 'fc-applying-as': 'no' });
        setExpectNoErrors(true);
      });
      after(() => {
        setBaseFormData({});
        setExpectNoErrors(false);
      });

      describe('fc-student-name', () => {
        text('fc-student-name', getDispute, false);
      });

      describe('fc-student-ssn', () => {
        ssn('fc-student-ssn', getDispute, false);
      });
    });
  });

  describe('documents selection', () => {
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(l => {
      const name = `fc-documents-${l}`;
      describe(name, () => {
        checkbox(name, getDispute);
      });
    });
  });

  describe('fc-tuition-payment', () => {
    text.medium('fc-tuition-payment', getDispute, true);
  });

  describe('fc-explain', () => {
    text.medium('fc-explain', getDispute, true);
  });
};
