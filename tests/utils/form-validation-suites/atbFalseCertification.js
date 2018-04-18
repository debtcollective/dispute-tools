const { setBaseFormData, setExpectNoErrors } = require('./helpers');
const yesnoRadio = require('./field-validation-suites/yesnoRadio');
const text = require('./field-validation-suites/text');
const ssn = require('./field-validation-suites/ssn');
const date = require('./field-validation-suites/date');

module.exports = getDispute => {
  describe('False Certification - Ability to Benefit', () => {
    describe('atb-attended-at', () => {
      yesnoRadio('atb-attended-at', getDispute, true);
    });

    describe('atb-attended-where', () => {
      yesnoRadio('atb-attended-where', getDispute, true);
    });

    describe('atb-applying-as', () => {
      yesnoRadio('atb-applying-as', getDispute, true);

      describe('when yes', () => {
        before(() => {
          setBaseFormData({ 'atb-applying-as': 'yes' });
        });

        after(() => {
          setBaseFormData({});
        });

        describe('atb-student-name', () => {
          text.long('atb-student-name', getDispute, true);
        });

        describe('atb-student-ssn', () => {
          ssn('atb-student-ssn', getDispute, true);
        });
      });
    });

    describe('atb-applying-as', () => {
      yesnoRadio('atb-applying-as', getDispute, true);

      describe('when yes', () => {
        before(() => {
          setBaseFormData({ 'atb-applying-as': 'no' });
          setExpectNoErrors(true);
        });

        after(() => {
          setBaseFormData({});
          setExpectNoErrors(false);
        });

        describe('atb-student-name', () => {
          text.long('atb-student-name', getDispute, false);
        });

        describe('atb-student-ssn', () => {
          ssn('atb-student-ssn', getDispute, false);
        });
      });
    });

    describe('atb-school-date', () => {
      date('atb-school-date', getDispute, true);
    });

    describe('atb-program-of-study', () => {
      text.long('atb-program-of-study', getDispute, true);
    });

    describe('atb-have-ged', () => {
      yesnoRadio('atb-have-ged', getDispute, true);
    });

    describe('atb-received-ged', () => {
      yesnoRadio('atb-received-ged', getDispute, true);
    });

    describe('atb-enrolled-at', () => {
      date('atb-enrolled-at', getDispute, true);
    });

    describe('atb-entrance-exam', () => {
      yesnoRadio('atb-entrance-exam', getDispute, true);

      describe('when yes', () => {
        before(() => {
          setBaseFormData({ 'atb-entrance-exam': 'yes' });
        });

        after(() => {
          setBaseFormData({});
        });

        describe('atb-entrance-exam-date', () => {
          date('atb-entrance-exam-date', getDispute, true);
        });

        describe('atb-entrance-exam-name', () => {
          text('atb-entrance-exam-name', getDispute, true);
        });

        describe('atb-entrance-exam-score', () => {
          text('atb-entrance-exam-score', getDispute, true);
        });
      });

      describe('when no', () => {
        before(() => {
          setBaseFormData({ 'atb-entrance-exam': 'no' });
          setExpectNoErrors(true);
        });

        after(() => {
          setBaseFormData({});
          setExpectNoErrors(false);
        });

        describe('atb-entrance-exam-date', () => {
          date('atb-entrance-exam-date', getDispute, false);
        });

        describe('atb-entrance-exam-name', () => {
          text('atb-entrance-exam-name', getDispute, false);
        });

        describe('atb-entrance-exam-score', () => {
          text('atb-entrance-exam-score', getDispute, false);
        });
      });
    });

    describe('atb-entrance-exam-improper', () => {
      yesnoRadio('atb-entrance-exam-improper', getDispute, true);

      describe('when yes', () => {
        before(() => {
          setBaseFormData({ 'atb-entrance-exam-improper': 'yes' });
        });

        after(() => {
          setBaseFormData({});
        });

        describe('atb-entrance-exam-improper-explain', () => {
          text.medium('atb-entrance-exam-improper-explain', getDispute, true);
        });
      });

      describe('when no', () => {
        before(() => {
          setBaseFormData({ 'atb-entrance-exam-improper': 'no' });
          setExpectNoErrors(true);
        });

        after(() => {
          setBaseFormData({});
          setExpectNoErrors(false);
        });

        describe('atb-entrance-exam-improper-explain', () => {
          text.medium('atb-entrance-exam-improper-explain', getDispute, false);
        });
      });
    });
  });
};
