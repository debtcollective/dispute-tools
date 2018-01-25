const DisputeTemplate = require('../../DisputeTemplate');
const { formatDate } = require('../shared/utils');
const { range } = require('lodash');

const checkbox = n => `Check Box${n}`;
const requestAdditionalFacts =
  'I am requesting an in-person or telephone hearing because there are additional facts that I believe can only be described in person or by phone.'; // eslint-disable-line

const YES = 'Yes';
const NO = 'Off';

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

          const indexed = disputeProcess + 17;
          const ret = range(17, 20).reduce((acc, n) =>
            Object.assign({}, acc, {
              [checkbox(n)]: n === indexed ? YES : NO,
            }),
          );

          if (disputeProcess === 2 || disputeProcess === 3) {
            ret[`Telephone ${disputeProcess - 1}`] = phone;
          }

          return ret;
        },
        getObjections(objectionOption, { schoolName }) {
          const ret = range(20, 32).reduce(
            (acc, n) => Object.assign(acc, { [checkbox(n)]: NO }),
            {},
          );

          switch (objectionOption) {
            default:
            case 'A':
              ret[checkbox(21)] = YES;
              ret.number1 = '1';
              break;
            case 'B':
              ret[checkbox(27)] = YES;
              ret.number1 = '7';
              break;
            case 'C':
              ret[checkbox(30)] = YES;
              ret['School 3'] = schoolName;
              ret.number1 = '10';
              break;
            case 'D':
              ret[checkbox(31)] = YES;
              ret['School 4'] = schoolName;
              ret.number1 = '11';
              break;
            case 'E':
              ret[checkbox(32)] = YES;
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
        const address2 =
          form.address2 || `${form.city}, ${form.state} ${form['zip-code']}`;

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
      post(pdf, { signature }) {
        pdf.editPage(2);
        pdf.text(
          requestAdditionalFacts,
          90,
          725,
          DisputeTemplate.PDF_WRITER_CONFIG,
        );

        pdf.text(signature, 290, 703, DisputeTemplate.PDF_WRITER_CONFIG);

        pdf.endPage();
      },
    }),
  ],
};
