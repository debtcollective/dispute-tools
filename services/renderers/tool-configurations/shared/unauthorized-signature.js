const DisputeTemplate = require('../../DisputeTemplate');
const { map } = require('lodash');
const { pathHelper, formatDate, normalizeSsn, getAddress2 } = require('./utils');

const page1 = pathHelper(0)(1);
const page2 = pathHelper(0)(2);
const studSsn = i => `${page1('#area')}.StudentSSN${i}[0]`;
const regSsn = i => `${page1('#area', 1)}.SSN${i}[0]`;
const docBox = i => page1('Documents', i);

const documents = {
  a: docBox(0),
  b: docBox(1),
  c: docBox(2),
  d: docBox(3),
  e: docBox(4),
  f: docBox(5),
  g: docBox(6),
};

const YES = '1';
const NO = '2';

module.exports = {
  templates: [
    new DisputeTemplate({
      file: ['unauthorized_signature_form', '0.pdf'],
      type: DisputeTemplate.RENDER_TYPE.PDF,
      data: {
        getSsn({ ssn }) {
          const [ssn1, ssn2, ssn3] = normalizeSsn(ssn);

          return {
            [regSsn(1)]: ssn1,
            [regSsn(2)]: ssn2,
            [regSsn(3)]: ssn3,
          };
        },
        getApplyingAs({ 'fc-applying-as': applyingAs, 'fc-student-name': studentName, 'fc-student-ssn': studentSsn }) {
          const ret = {};

          if (applyingAs === 'yes') {
            ret[page1('Applying')] = YES;
            ret[page1('StudentName')] = studentName;

            const [ssn1, ssn2, ssn3] = normalizeSsn(studentSsn);
            ret[studSsn(1)] = ssn1;
            ret[studSsn(2)] = ssn2;
            ret[studSsn(3)] = ssn3;
          } else {
            ret[page1('Applying', 1)] = NO;
          }

          return ret;
        },
        getSignedDocuments(form) {
          const ret = {};

          map(documents, (box, letter) => {
            if (form[`fc-documents-${letter}`] === 'yes') {
              ret[box] = YES;
            }
          });

          return ret;
        },
      },
      normalize({ forms: { 'personal-information-form': form } }) {
        return Object.assign(
          {
            [page1('Name')]: form.name,
            [page1('Address')]: form.address1,
            [page1('CityStateZipCode')]: getAddress2({ form }),
            [page1('Email')]: form.email,
            [page1('Phone1')]: form.phone,
            [page1('Phone2')]: form.phone2 || '', // prevent 'undefined' on form
            [page1('SchoolName')]: form.schoolName,
            [page1('SchoolAddress')]: `${form['school-address']}, ${getAddress2({ form, prefix: 'school-' })}`,
            [page1('DateFrom')]: form['school-attended-from'],
            [page1('DateTo')]: form['school-attended-to'],
            [page1('YesNo1')]: NO, // always no based on the old template
            [page1('HowDidYouPay')]: form['fc-tuition-payment'],
            [page1('NameofPerson')]: "I don't know",
            [page2('HowDidYouPay')]: form['fc-explain'],
            [page2('YesNo2')]: NO, // always no based on old template
            [page2('YesNo3')]: NO, // ''
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
