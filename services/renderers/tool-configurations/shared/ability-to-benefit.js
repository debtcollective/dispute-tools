const DisputeTemplate = require('../../DisputeTemplate');
const { pathHelper, normalizeSsn, formatDate, getAddress2 } = require('./utils');

const page1 = pathHelper(0)(1);
const page2 = pathHelper(0)(2);
const page3 = pathHelper(0)(3);
const primarySsn = i => `${page1('#area', 1)}.SSN${i}[0]`;
const studSsn = i => `${page1('#area')}.StudentSSN${i}[0]`;

const YES = '1';
const NO = '2';

module.exports = {
  templates: [
    new DisputeTemplate({
      type: DisputeTemplate.RENDER_TYPE.PDF,
      file: ['falsecert_ability_to_benefit', '0.pdf'],
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
          'atb-applying-as': applyingAs,
          'atb-student-name': studentName,
          'atb-student-ssn': studentSsn,
        }) {
          const ret = {};

          if (applyingAs === 'yes') {
            ret[page1('Applying', 1)] = NO;
            ret[page1('StudentName')] = studentName;

            const [ssn1, ssn2, ssn3] = normalizeSsn(studentSsn);

            ret[studSsn(1)] = ssn1;
            ret[studSsn(2)] = ssn2;
            ret[studSsn(3)] = ssn3;
          } else {
            ret[page1('Applying')] = YES;
          }

          return ret;
        },
        getPreviouslyAttended({
          'atb-attended-at': attendedBeforeJuly1st,
          // See :57-61
          // 'atb-attended-where': officiallyRegistered,
        }) {
          const ret = {};

          if (attendedBeforeJuly1st === 'yes') {
            ret[page1('YesNo1', 1)] = YES;
          } else {
            ret[page1('YesNo1')] = NO; // 0.fdf:98
            // We don't let users finish filling out the form
            // if they select no for the following option, and
            // it only needs to be filled in if they answered
            // no to the previous question, therefore, this
            // will always pass
            ret[page1('YesNo3')] = YES;
          }

          return ret;
        },
        getGED({
          // See above, same reason, cannot complete the form if you answer no here
          // 'atb-have-ged': hadGEDWhileEnrolled,
          'atb-received-ged': receivedGEDAfterCompletingProgram,
        }) {
          const ret = {};

          // Always have to answer no for had GED while enrolled
          ret[page1('YesNo5')] = NO; // fdf:194

          if (receivedGEDAfterCompletingProgram === 'yes') {
            ret[page1('YesNo6')] = YES;
          } else {
            ret[page1('YesNo6', 1)] = NO; // fdf:212
          }

          return ret;
        },
        getEntranceExam({
          'atb-entrance-exam': tookEntranceExam,
          'atb-entrance-exam-date': examDate,
          'atb-entrance-exam-name': examName,
          'atb-entrance-exam-score': examScore,
          'atb-entrance-exam-improper': examAppearedImproperlyAdministered,
          'atb-entrance-exam-improper-explain': improprietyExplained,
          'atb-entrance-exam-radio-option': existsSomeoneToSupportClaim,
          'atb-entrance-exam-supporter-name': nameOfSomeoneSupportingClaim,
          'atb-entrance-exam-supporter-address': supporterAddress,
          'atb-entrance-exam-supporter-address2': supporterAddress2,
          'atb-entrance-exam-supporter-city': supporterCity,
          'atb-entrance-exam-supporter-state': supporterState,
          'atb-entrance-exam-supporter-zip-code': supporterZipCode,
          'atb-entrance-exam-supporter-phone': supporterPhone,
        }) {
          const ret = {};

          if (tookEntranceExam === 'yes') {
            ret[page2('YesNo7', 2)] = YES;
            ret[page2('Date')] = formatDate(examDate);
            ret[page2('NameofTest')] = examName;
            ret[page2('ScoreofTest')] = examScore;

            if (examAppearedImproperlyAdministered === 'yes') {
              ret[page2('YesNo8', 1)] = YES;
              ret[page2('Explain')] = improprietyExplained;
              if (existsSomeoneToSupportClaim === 'yes') {
                ret[page2('NameofParty')] = nameOfSomeoneSupportingClaim;
                ret[page2('Phone1')] = supporterPhone;
                ret[page2('Address')] = `${supporterAddress}, ${supporterAddress2 ||
                  `${supporterCity}, ${supporterState} ${supporterZipCode}`}`;
              }
            } else {
              ret[page2('YesNo8')] = NO;
            }
          } else {
            ret[page2('YesNo7')] = NO; // fdf:290
          }

          return ret;
        },
        getRemedial({
          'atb-remedial-program-completed': remedialProgramCompleted,
          'atb-remedial-program-name': programName,
          'atb-remedial-program-from': dateFrom,
          'atb-remedial-program-to': dateTo,
          'atb-remedial-program-courses': courses,
          'atb-remedial-program-grades': grades,
        }) {
          const ret = {};

          if (remedialProgramCompleted === 'yes') {
            ret[page2('YesNo9', 2)] = YES;
            ret[page2('Program')] = programName;
            ret[page2('DateFrom')] = dateFrom;
            ret[page2('DateTo')] = dateTo;
            ret[page2('Courses')] = courses;
            ret[page2('Grades')] = grades;
          } else {
            ret[page2('YesNo9', 1)] = NO;
          }

          return ret;
        },
      },
      normalize({ forms: { 'personal-information-form': form } }) {
        const address2 = getAddress2({ form });
        const schoolAddress = `${form['school-address']}, ${getAddress2({
          form,
          prefix: 'school-',
        })}`;

        const ret = Object.assign(
          {
            [page1('Name')]: form.name,
            [page1('Address')]: form.address1,
            [page1('CityStateZipCode')]: address2,
            [page1('Phone1')]: form.phone,
            [page1('Phone2')]: form.phone2 || '',
            [page1('Email')]: form.email,
            [page1('SchoolName')]: form.schoolName,
            [page1('SchoolAddress')]: schoolAddress,
            [page1('Date')]: formatDate(form['atb-school-date']),
            [page1('YesNo4', 1)]: YES,
            [page1('DateFrom')]: formatDate(form['school-attended-from']),
            [page1('DateTo')]: formatDate(form['school-attended-to']),
            [page1('Program')]: form['atb-program-of-study'],
            [page1('Date', 1)]: formatDate(form['atb-enrolled-at']),
            // Required NO to complete form
            [page2('YesNo9a', 1)]: NO,
            [page2('YesNo10')]: NO,
            [page2('YesNo11', 1)]: NO,
            [page3('DateSigned1')]: formatDate(new Date()),
          },
          ...this.execDataFunctions(form),
        );
        return ret;
      },
      post(pdf, { signature }) {
        pdf.editPage(3);
        pdf.text(signature, 140, 255, DisputeTemplate.PDF_WRITER_CONFIG);
        pdf.endPage();
      },
    }),
  ],
};
