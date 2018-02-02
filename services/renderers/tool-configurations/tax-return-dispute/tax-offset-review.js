const DisputeTemplate = require('../../DisputeTemplate');
const { formatDate, getAddress2 } = require('../shared/utils');
const { range } = require('lodash');
const {
  requestAdditionalFacts,
  CheckboxAnswer: { YES, NO },
  DisputeProcess,
  checkboxKey,
} = require('../shared/federal-student-loan-disputes.js');

/**
 * Refer to lib/assets/document_templates/tax_offset_review/0.fdf
 * for the extracted form data that maps the names used below to the
 * appropriate field on the pdf
 */
module.exports = {
  templates: [
    new DisputeTemplate({
      type: DisputeTemplate.RENDER_TYPE.PDF,
      file: ['tax_offset_review', '0.pdf'],
      data: {
        getDisputeProcess(disputeProcess, { phone }) {
          disputeProcess = parseInt(disputeProcess, 10);

          // disputeProcess must be one of the values in DisputeProcess
          // eslint-disable-next-line
          console.assert(
            Object.values(DisputeProcess).includes(disputeProcess),
          );

          const ret = {};
          // 18 == written, 19 == in person, 20 == by phone
          ret[checkboxKey(17 + disputeProcess)] = YES; // off by default
          ret[`Telephone ${disputeProcess - 1}`] = phone;

          return ret;
        },
        getObjections(objectionOption, { schoolName }) {
          const ret = range(20, 32).reduce(
            (acc, n) => Object.assign(acc, { [checkboxKey(n)]: NO }),
            {},
          );

          switch (objectionOption) {
            default:
            case 'A':
              ret[checkboxKey(21)] = YES;
              ret.number1 = '1';
              break;
            case 'B':
              ret[checkboxKey(27)] = YES;
              ret.number1 = '7';
              break;
            case 'C':
              ret[checkboxKey(30)] = YES;
              ret['School 3'] = schoolName;
              ret.number1 = '10';
              break;
            case 'D':
              ret[checkboxKey(31)] = YES;
              ret['School 4'] = schoolName;
              ret.number1 = '11';
              break;
            case 'E':
              ret[checkboxKey(32)] = YES;
              ret['School 5'] = schoolName;
              ret.number1 = '12';
              break;
          }

          return ret;
        },
      },
      normalize({
        disputeProcess,
        option,
        forms: { 'personal-information-form': form },
      }) {
        const address2 = getAddress2({ form });

        const disputeProcessCheckboxes = this.data.getDisputeProcess(
          disputeProcess,
          form,
        );
        const objectionsCheckboxes = this.data.getObjections(option, form);

        return Object.assign(
          {},
          {
            Name: form.name,
            SSN: form.ssn,
            'Current Address': `${form.address1}, ${address2}`,
            'Date 6': formatDate(new Date()),
          },
          disputeProcessCheckboxes,
          objectionsCheckboxes,
        );
      },
      post(pdf, { signature, disputeProcess }) {
        pdf.editPage(2);
        // put the signature on page 2 at coordinates (290, 703)
        pdf.text(signature, 290, 703, DisputeTemplate.PDF_WRITER_CONFIG);

        disputeProcess = parseInt(disputeProcess, 10);
        if (
          disputeProcess === DisputeProcess.INPERSON ||
          disputeProcess === DisputeProcess.BYPHONE
        ) {
          // add the request text on page 2 at coordinates (90, 725)
          pdf.text(
            requestAdditionalFacts,
            90,
            725,
            DisputeTemplate.PDF_WRITER_CONFIG,
          );
        }

        pdf.endPage();
      },
    }),
  ],
};
