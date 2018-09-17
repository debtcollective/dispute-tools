// Maps the user-input responses to the fields in the wage garnishment PDF form.
// Note that a lot of the PDF form's field names are long and weird.

const DisputeTemplate = require('$services/renderers/DisputeTemplate');
const { formatDate, getAddress2, normalizeSsn } = require('../shared/utils');
const {
  requestAdditionalFacts,
  checkboxKey,
  DisputeProcess: { WRITTEN, INPERSON, BYPHONE },
  CheckboxAnswer: { YES },
} = require('../shared/federal-student-loan-disputes.js');
const { doeDisclosure } = require('$config/config');
const doeDisclosureConfig = require('$lib/assets/document_templates/wage_garnishment/consent-to-disclosure');

const cityFieldNames = {
  // key is disputeProcessCity; value is the field name in 0.fdf
  Chicago: 'Chicago. IL',
  'San Francisco': 'San Francisco',
  // You would expect the field name to be 'Atlanta' or something else more logical
  // but it isn't. See `lib/assets/document_templates/wage_garnishment/0.fdf`
  Atlanta: 'I want this InPerson hearing held in',
};

/**
 * Refer to lib/assets/document_templates/wage_garnishment/0.fdf
 * for the extracted form data that maps the names used below to the
 * appropriate field on the pdf
 */
module.exports = {
  templates: [
    new DisputeTemplate({
      type: DisputeTemplate.RENDER_TYPE.PDF,
      file: ['wage_garnishment', '0.pdf'],
      data: {
        fillDisputeProcessFields(disputeProcess, disputeProcessCity, { phone }) {
          const field = {
            [WRITTEN]: 2,
            [INPERSON]: 18,
            [BYPHONE]: 3,
          };

          const ret = {};
          ret[checkboxKey(field[disputeProcess])] = YES;

          switch (disputeProcess) {
            case INPERSON:
              ret[cityFieldNames[disputeProcessCity]] = 'X';
              break;
            case BYPHONE:
              ret['day time telephone number'] = phone;
              break;
            default:
          }

          return ret;
        },

        fillObjectionsFields(option, disputeProcess, { schoolName }) {
          const field = {
            A: 4,
            B: 13,
            C: 14,
            D: 15,
            E: 17,
          };
          const objectionNum = { A: 1, B: 10, C: 11, D: 12, E: 14 };

          const ret = {};
          ret[checkboxKey(field[option])] = YES;

          if (disputeProcess === INPERSON || disputeProcess === BYPHONE) {
            ret[
              'necessary on a separate sheet of paper If you have already fully described these facts in your response'
            ] =
              objectionNum[option];
          }

          switch (option) {
            // fill in schoolName in correct text field
            case 'D':
              ret['school I or for parent PLUS borrowers the student had a condition'] = schoolName;
              break;
            case 'E':
              ret['14    I believe that'] = schoolName;
              break;
            default:
          }

          return ret;
        },
      },
      normalize({
        disputeProcess,
        disputeProcessCity,
        option,
        forms: { 'personal-information-form': form },
      }) {
        const basicInfo = {
          borr_name: form.name,
          'Social Security Number': form.ssn,
          borr_address_1: form.address1,
          borr_address_2: getAddress2({ form }),
          borr_telephone: form.phone,
          Text1: formatDate(new Date()),
        };

        const employmentInfo = {};
        if (form['employment-radio-option'] === 'yes') {
          employmentInfo.employer = form.employer;
          employmentInfo.employer_address_1 = form.employerAddress1;
          employmentInfo.employer_address_2 = getAddress2({
            form,
            address2: 'Address2',
            zipCode: 'ZipCode',
            city: 'City',
            state: 'State',
            prefix: 'employer',
          });
          employmentInfo.employer_telephone = form.employerPhone;
          employmentInfo.beginning_date_of_employment = form.employmentDate;
        }

        disputeProcess = parseInt(disputeProcess, 10);

        const disputeProcessInfo = this.data.fillDisputeProcessFields(
          disputeProcess,
          disputeProcessCity,
          form,
        );

        const objectionsInfo = this.data.fillObjectionsFields(option, disputeProcess, form);

        return Object.assign(basicInfo, employmentInfo, disputeProcessInfo, objectionsInfo);
      },
      post(pdf, { signature }) {
        pdf.editPage(3);

        // add the request text on page 3 at (90, 750)
        pdf.text(requestAdditionalFacts, 90, 750, DisputeTemplate.PDF_WRITER_CONFIG);

        // add the signature on page 3 at (290, 548)
        pdf.text(signature, 290, 548, DisputeTemplate.PDF_WRITER_CONFIG);

        pdf.endPage();
      },
    }),
    new DisputeTemplate({
      type: DisputeTemplate.RENDER_TYPE.PDF,
      file: ['wage_garnishment', 'consent-to-disclosure.pdf'],
      iff: ({ forms: { 'personal-information-form': form } }) =>
        form['doe-privacy-release'] === 'yes',
      normalize: () => null,
      post(
        pdf,
        {
          signature,
          forms: { 'personal-information-form': form },
        },
      ) {
        pdf.editPage(1);

        const name = form.name;
        const address = form.address1;
        const email = form.email;
        const city = form.city;
        const state = form.state;
        const zip = form['zip-code'];
        const phone = form.phone.replace(/[^0-9]/g, '');
        const areaCode = phone.substring(0, 3);
        const phoneBody = `${phone.substring(3, 6)}-${phone.substring(6)}`;
        const ssn = normalizeSsn(form.ssn).join('-');
        const dob = formatDate(form.dob, 'MM/DD/YY');

        pdf.text(name, ...doeDisclosureConfig.member.name);
        pdf.text(address, ...doeDisclosureConfig.member.address);
        pdf.text(city, ...doeDisclosureConfig.member.city);
        pdf.text(state, ...doeDisclosureConfig.member.state);
        pdf.text(zip, ...doeDisclosureConfig.member.zip);
        pdf.text(areaCode, ...doeDisclosureConfig.member.phone.areaCode);
        pdf.text(phoneBody, ...doeDisclosureConfig.member.phone.rest);
        pdf.text(email, ...doeDisclosureConfig.member.email);
        pdf.text(ssn, ...doeDisclosureConfig.member.ssn);
        pdf.text(dob, ...doeDisclosureConfig.member.dob);

        pdf.text(doeDisclosure.representatives, ...doeDisclosureConfig.representatives.names);
        pdf.text(doeDisclosure.address, ...doeDisclosureConfig.representatives.address);
        pdf.text(doeDisclosure.city, ...doeDisclosureConfig.representatives.city);
        pdf.text(doeDisclosure.state, ...doeDisclosureConfig.representatives.state);
        pdf.text(doeDisclosure.zip, ...doeDisclosureConfig.representatives.zip);
        pdf.text(doeDisclosure.phones, ...doeDisclosureConfig.representatives.phones);
        pdf.text(doeDisclosure.relationship, ...doeDisclosureConfig.representatives.relationships);

        pdf.text(formatDate(new Date()), ...doeDisclosureConfig.signature.date);
        pdf.text(signature, ...doeDisclosureConfig.signature.signature);

        pdf.endPage();
      },
    }),
  ],
};
