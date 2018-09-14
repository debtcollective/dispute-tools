const { expect } = require('chai');
const {
  extractToolFormValidations,
  getCheckitConfig,
  foldToOptionFieldsValidationsObject,
} = require('$services/formValidation');
const creditReportDispute = require('$form-definitions/credit-report-dispute');
const generalDebtDispute = require('$form-definitions/general-debt-dispute');
const privateStudentLoanDispute = require('$form-definitions/private-student-loan-dispute');
const taxOffsetDispute = require('$form-definitions/tax-offset-dispute');
const wageGarnishmentDispute = require('$form-definitions/wage-garnishment-dispute');

describe('formValidations', () => {
  describe('checkit configuration cache', () => {
    describe('credit report dispute', () => {
      const dispute = {
        disputeTool: { slug: 'credit-report-dispute' },
        data: { option: 'none' },
      };

      it('should cache the none option on load', () => {
        expect(getCheckitConfig(dispute)).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(creditReportDispute))[
            dispute.data.option
          ],
        );
      });
    });

    describe('general debt dispute', () => {
      const dispute = {
        disputeTool: { slug: 'general-debt-dispute' },
        data: { option: 'none' },
      };

      it('should cache the none option on load', () => {
        expect(getCheckitConfig(dispute)).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(generalDebtDispute))[
            dispute.data.option
          ],
        );
      });
    });

    describe('private student loan dispute', () => {
      const dispute = {
        disputeTool: { slug: 'private-student-loan-dispute' },
        data: { option: 'none' },
      };

      it('should cache the none option on load', () => {
        expect(getCheckitConfig(dispute)).eql(
          foldToOptionFieldsValidationsObject(
            extractToolFormValidations(privateStudentLoanDispute),
          )[dispute.data.option],
        );
      });
    });

    describe('tax offset dispute', () => {
      const dispute = {
        disputeTool: { slug: 'tax-offset-dispute' },
        data: { option: 'none' },
      };

      it('should cache the A option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'A' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(taxOffsetDispute)).A,
        );
      });

      it('should cache the B option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'B' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(taxOffsetDispute)).B,
        );
      });

      it('should cache the C option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'C' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(taxOffsetDispute)).C,
        );
      });

      it('should cache the D option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'D' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(taxOffsetDispute)).D,
        );
      });

      it('should cache the E option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'E' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(taxOffsetDispute)).E,
        );
      });
    });

    describe('wage garnishment dispute', () => {
      const dispute = {
        disputeTool: { slug: 'wage-garnishment-dispute' },
        data: { option: 'none' },
      };

      it('should cache the A option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'A' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(wageGarnishmentDispute)).A,
        );
      });

      it('should cache the B option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'B' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(wageGarnishmentDispute)).B,
        );
      });

      it('should cache the C option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'C' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(wageGarnishmentDispute)).C,
        );
      });

      it('should cache the D option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'D' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(wageGarnishmentDispute)).D,
        );
      });

      it('should cache the E option on load', () => {
        expect(getCheckitConfig({ ...dispute, data: { ...dispute.data, option: 'E' } })).eql(
          foldToOptionFieldsValidationsObject(extractToolFormValidations(wageGarnishmentDispute)).E,
        );
      });
    });
  });
});
