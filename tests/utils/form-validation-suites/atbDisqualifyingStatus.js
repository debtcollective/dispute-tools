const { setBaseFormData, setExpectNoErrors } = require('./helpers');
const yesnoRadio = require('./field-validation-suites/yesnoRadio');
const text = require('./field-validation-suites/text');
const ssn = require('./field-validation-suites/ssn');
const checkbox = require('./field-validation-suites/checkbox');

module.exports = getDispute => {
  describe('atbd-applying-as', () => {
    yesnoRadio('atbd-applying-as', getDispute, true);

    describe('when yes', () => {
      before(() => setBaseFormData({ 'atbd-applying-as': 'yes' }));
      after(() => setBaseFormData({}));

      describe('atbd-student-name', () => {
        text('atbd-student-name', getDispute, true);
      });

      describe('atbd-student-ssn', () => {
        ssn('atbd-student-ssn', getDispute, true);
      });
    });

    describe('when no', () => {
      before(() => {
        setBaseFormData({ 'atbd-applying-as': 'no' });
        setExpectNoErrors(true);
      });
      after(() => {
        setBaseFormData({});
        setExpectNoErrors(false);
      });

      describe('atbd-student-name', () => {
        text('atbd-student-name', getDispute, false);
      });

      describe('atbd-student-ssn', () => {
        ssn('atbd-student-ssn', getDispute, false);
      });
    });
  });

  describe('atbd-program-of-study', () => {
    text('atbd-program-of-study', getDispute, true);
  });

  describe('regulation options', () => {
    [1, 2, 3, 4].forEach(n => {
      describe(`atbd-option${n}`, () => {
        checkbox(`atbd-option${n}`, getDispute);
      });
    });

    describe('atbd-option5', () => {
      checkbox('atbd-option5', getDispute);

      describe('when yes', () => {
        before(() => setBaseFormData({ 'atbd-option5': 'yes' }));
        after(() => setBaseFormData({}));

        describe('atbd-option5-text', () => {
          text('atbd-option5-text', getDispute, true);
        });
      });

      describe('when no', () => {
        before(() => {
          setBaseFormData({ 'atbd-option5': 'no' });
          setExpectNoErrors(true);
        });

        after(() => {
          setBaseFormData({});
          setExpectNoErrors(false);
        });

        describe('atbd-option5-text', () => {
          text('atbd-option5-text', getDispute, false);
        });
      });
    });
  });

  describe('atbd-law', () => {
    text.medium('atbd-law', getDispute, true);
  });

  describe('atbd-reason-not-to-benefit', () => {
    yesnoRadio('atbd-reason-not-to-benefit', getDispute, true);

    describe('when yes', () => {
      before(() => setBaseFormData({ 'atbd-reason-not-to-benefit': 'yes' }));
      after(() => setBaseFormData({}));

      describe('atbd-inform', () => {
        yesnoRadio('atbd-inform', getDispute, true);
      });
    });

    describe('when no', () => {
      before(() => {
        setBaseFormData({ 'atbd-reason-not-to-benefit': 'no' });
        setExpectNoErrors(true);
      });

      after(() => {
        setBaseFormData({});
        setExpectNoErrors(false);
      });

      describe('atbd-inform', () => {
        yesnoRadio('atbd-inform', getDispute, false);
      });
    });
  });
};
