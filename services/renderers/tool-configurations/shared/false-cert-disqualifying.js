const DisputeTemplate = require('../../DisputeTemplate');
const { pathHelper, normalizeSsn, formatDate } = require('./utils');

const page1 = pathHelper(0)(1);
const page2 = pathHelper(0)(2);
const primarySsn = i => `${page1('#area')}.SSN${i}[0]`;
const studSsn = i => `${page1('#area', 1)}.StudentSSN${i}[0]`;

/**
 * For any fdf buttons whose 'On' value is not '1' the line number
 * in the fdf dump has been annotated indicating how we know what
 * the value for the 'On' option is
 */
const YES = '1';
const NO = '2';

/**
 * Refer to lib/assets/document_templates/falsecert_disqualifying/0.fdf
 * for the map of names to the corresponding PDF fields
 */
module.exports = {
  templates: [
    new DisputeTemplate({
      type: DisputeTemplate.RENDER_TYPE.PDF,
      file: ['falsecert_disqualifying', '0.pdf'],
      data: {
        getSsn({ ssn }) {
          const [ssn1, ssn2, ssn3] = normalizeSsn(ssn);

          return {
            [primarySsn(1)]: ssn1,
            [primarySsn(2)]: ssn2,
            [primarySsn(3)]: ssn3,
          };
        },
        getApplyingAs({
          'atbd-applying-as': applyingAs,
          'atbd-student-name': studentName,
          'atbd-student-ssn': studentSsn,
        }) {
          const ret = {};

          if (applyingAs === 'yes') {
            ret[page1('Applying')] = NO; // 0.fdf:83 -- go figure why this one's opposite
            ret[page1('StudentName')] = studentName;
            const [ssn1, ssn2, ssn3] = normalizeSsn(studentSsn);
            ret[studSsn(1)] = ssn1;
            ret[studSsn(2)] = ssn2;
            ret[studSsn(3)] = ssn3;
          } else {
            ret[page1('Applying', 1)] = YES; // 0.fdf.137
          }

          return ret;
        },
        getDisqualifyingStatus({
          'atbd-option1': age,
          'atbd-option2': physicalCondition,
          'atbd-option3': mentalCondition,
          'atbd-option4': criminalRecord,
          'atbd-option5': other,
          'atbd-option5-text': otherText,
        }) {
          const ret = {};

          if (age === 'yes') {
            ret[page1('Status')] = YES;
          }

          if (physicalCondition === 'yes') {
            ret[page1('Status', 1)] = YES;
          }

          if (mentalCondition === 'yes') {
            ret[page1('Status', 2)] = YES;
          }

          if (criminalRecord === 'yes') {
            ret[page1('Status', 3)] = YES;
          }

          if (other === 'yes') {
            ret[page1('Status', 4)] = YES;
            ret[page1('SpecifyOther')] = otherText;
          }

          return ret;
        },
        getWasAsked({
          'atbd-reason-not-to-benefit': asked,
          'atbd-inform': inform,
        }) {
          const ret = {};

          if (asked === 'yes') {
            ret[page1('Existed', 2)] = YES;
          } else {
            ret[page1('Existed')] = NO; // 0.fdf:226

            if (inform === 'yes') {
              ret[page2('YesNo1', 1)] = YES;
            } else {
              ret[page2('YesNo1')] = NO; // fdf:284
            }
          }

          return ret;
        },
      },
      normalize({ forms: { 'personal-information-form': form } }) {
        const address2 =
          form.address2 ||
          `${
            form.city // fallback to old address collection
          }, ${form.state}, ${form['zip-code']}`;
        const schoolAddress2 =
          form['school-address2'] ||
          `${form['school-city']}, ${form['school-state']}, ${
            form['school-zip-code']
          }`;

        const schoolFrom = new Date(form['school-attended-from']);
        const schoolTo = new Date(form['school-attended-to']);

        return Object.assign(
          {},
          {
            [page1('Name')]: form.name,
            [page1('Address')]: form.address1,
            [page1('CityStateZipCode')]: address2,
            [page1('Phone1')]: form.phone,
            [page1('Phone2')]: form.phone2,
            [page1('Email')]: form.email,
            [page1('SchoolName')]: form.schoolName,
            [page1('ProgramName')]: form['atbd-program-of-study'],
            [page1('SchoolAddress')]: `${
              form['school-address']
            }, ${schoolAddress2}`,
            [page1('DateFrom')]: formatDate(schoolFrom),
            [page1('DateTo')]: formatDate(schoolTo),
            // This one has the wrong name...
            [page1('SchoolAddress', 1)]: form['atbd-law'],
            [page2('YesNo2', 1)]: NO,
            [page2('YesNo3', 1)]: NO,
            [page2('DateSigned1')]: formatDate(new Date()),
          },
          ...this.execDataFunctions(form),
        );
      },
      post(pdf, { signature }) {
        pdf.editPage(2);
        pdf.text(signature, 140, 710, DisputeTemplate.PDF_WRITER_CONFIG);
        pdf.endPage();
      },
    }),
  ],
};
