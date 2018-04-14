/* eslint max-len: 0 */

const { personalInformation, ffelLoan, employment, yourSchool } = require('./shared-fields');

const Field = require('./validations');

const { US_STATES } = Field;
const { zip, ssn, phone, text, date, textMedium, textLong } = Field.FieldValidation;

const wageGarnishmentForm = {
  type: 'form',
  name: 'personal-information-form',
  title: 'Personal Information',
  description: 'Here we need some personal, school and employment information.',
  fieldSets: [personalInformation(), yourSchool(), ffelLoan(), employment()],
};

const taxOffsetForm = {
  type: 'form',
  name: 'personal-information-form',
  title: 'Personal Information',
  description: 'Here we need some personal information.',
  fieldSets: [personalInformation(), yourSchool(), ffelLoan()],
};

const personalStatement = {
  type: 'upload',
  name: 'personal-statement-uploader',
  multiple: false,
  optional: false,
  mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 5242880,
  title: 'Personal Statement',
  description:
    'In addition to providing evidence against the school, you can write a personal statement describing how your school lied to and defrauded you and upload it here.',
  uploadButtonText: 'Upload file',
  footerNotes: 'JPEG, PNG, PDF format',
};

const evidenceUploader = {
  type: 'upload',
  name: 'evidence-uploader',
  multiple: true,
  optional: false,
  mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 5242880,
  title: 'Evidence',
  description:
    'Please upload evidence (such as a notice you received in the mail or a paystub) showing your wages or taxes are being taken.',
  uploadButtonText: 'Upload files',
  footerNotes: 'JPEG, PNG, PDF format',
};

const unauthorizedSignatureForm = {
  title: 'False Certification - Unauthorized signature/payment',
  fields: [
    [
      new Field({
        name: 'fc-applying-as',
        label: 'Are you applying for this discharge as a parent',
        type: 'group',
        yesno: true,
        default: 'no',

        fields: [
          [
            new Field({
              name: 'fc-student-name',
              label: 'Student name (Last, First, MI)',
              columnClassName: 'md-col-6',
              validations: text,
            }),
            new Field({
              name: 'fc-student-ssn',
              label: 'Student SSN',
              columnClassName: 'md-col-6',
              validations: ssn,
            }),
          ],
        ],
      }),
    ],
    [
      new Field({
        title: 'Which documents(s) was signed without your permission?',
        type: 'group',

        fields: [
          [
            new Field({
              name: 'fc-documents-a',
              label: 'Loan Application',
              type: 'checkbox',
            }),
          ],
          [
            new Field({
              name: 'fc-documents-b',
              label: 'Promissory note',
              type: 'checkbox',
            }),
          ],
          [
            new Field({
              name: 'fc-documents-c',
              label: 'Master promissory note',
              type: 'checkbox',
            }),
          ],
          [
            new Field({
              name: 'fc-documents-d',
              label: 'Combined application/promissory node',
              type: 'checkbox',
            }),
          ],
          [
            new Field({
              name: 'fc-documents-e',
              label: 'Loan check',
              type: 'checkbox',
            }),
          ],
          [
            new Field({
              name: 'fc-documents-f',
              label: 'Electronic funds transfer authorization',
              type: 'checkbox',
            }),
          ],
          [
            new Field({
              name: 'fc-documents-g',
              label: 'Master check authorization',
              type: 'checkbox',
            }),
          ],
        ],
      }),
    ],

    [
      new Field({
        name: 'fc-tuition-payment',
        label: 'How did you (or the student) pay tuition and fees to attend the school?',
        type: 'text',
        validations: textMedium,
      }),
    ],
    [
      new Field({
        name: 'fc-explain',
        label:
          'Explain the circumstances under which the person signed your name without your permission',
        type: 'text',
        validations: textMedium,
      }),
    ],
  ],
};

const atbForm = {
  title: 'False Certification - Ability to Benefit',
  fields: [
    [
      new Field({
        name: 'atb-attended-at',
        label: 'Did you (or the student) attend college prior to July 1, 2012?',
        type: 'yesno',
        default: 'yes',

        alert: {
          no: {
            message: 'Sorry, You are not eligible for this discharge.',
          },
        },
      }),
      new Field({
        name: 'atb-attended-where',
        label:
          'Were you (or the student), prior to July 1, 2012, officially registered in college and scheduled to attend?',
        type: 'yesno',
        default: 'yes',

        alert: {
          no: {
            message: 'Sorry, You are not eligible for this discharge.',
          },
        },
      }),
    ],
    [
      new Field({
        name: 'atb-applying-as',
        label: 'Are you applying for this loan discharge as a parent',
        type: 'group',
        yesno: true,
        default: 'no',

        fields: [
          [
            new Field({
              name: 'atb-student-name',
              label: 'Student name (Last, First, MI)',
              columnClassName: 'md-col-6',
              validations: textLong,
            }),
            new Field({
              name: 'atb-student-ssn',
              label: 'Student SSN',
              columnClassName: 'md-col-6',
              validations: ssn,
            }),
          ],
        ],
      }),
    ],
    // PAGE 2
    [
      new Field({
        name: 'atb-school-date',
        label: 'On what date did you (or the student) begin attending the school?',
        type: 'date',
        validations: date,
      }),
    ],
    [
      new Field({
        name: 'atb-program-of-study',
        label: "What was your (or the student's) program of study?",
        validations: textLong,
      }),
    ],
    [
      new Field({
        name: 'atb-have-ged',
        label: 'Did you (or the student) have a high school diploma or a GED while enrolled?',
        type: 'yesno',
        default: 'no',

        alert: {
          yes: {
            message: 'Sorry, You are not eligible for this discharge.',
          },
        },
      }),
    ],
    [
      new Field({
        name: 'atb-received-ged',
        label: 'Did you (or the student) receive a GED before completing the program?',
        type: 'yesno',

        default: 'no',
      }),
    ],
    [
      new Field({
        name: 'atb-enrolled-at',
        label: 'When did you first enroll in college?',
        type: 'date',
        columnClassName: 'md-col-6',
        validations: date,
      }),
    ],
    [
      new Field({
        name: 'atb-entrance-exam',
        label:
          'Before you (or the student) enrolled in the college, were you given an entrance exam?',
        type: 'group',
        yesno: true,
        default: 'no',

        fields: [
          [
            new Field({
              name: 'atb-entrance-exam-date',
              label: 'Give the date you took the test if you know it',
              validations: date,
              attributes: {
                placeholder: "MM-DD-YYYY or I don't know",
              },
            }),
          ],
          [
            new Field({
              name: 'atb-entrance-exam-name',
              label: 'Give the name of the test if you know it',
              attributes: {
                placeholder: "Name or I don't know",
              },
              validations: text,
            }),
          ],
          [
            new Field({
              name: 'atb-entrance-exam-score',
              label: 'Give the score of the test if you know it',
              attributes: {
                placeholder: "Score or I don't know",
              },
              validations: text,
            }),
          ],
        ],
      }),
      new Field({
        name: 'atb-entrance-exam-improper',
        label: 'Did anything appear improper about the way the test was given?',
        type: 'group',
        yesno: true,
        default: 'no',

        fields: [
          [
            new Field({
              name: 'atb-entrance-exam-improper-explain',
              label: 'Explain in detail what appeared improper',
              type: 'text',
              validations: textMedium,
            }),
          ],
        ],
      }),
    ],
    [
      new Field({
        title: 'Can anyone support the statement that the test was not given properly?',
        subtitle: 'Please provide a name, address, and phone number for that person.',
        type: 'group',
        yesno: true,
        name: 'atb-entrance-exam-radio-option',
        default: 'no',
        fields: [
          [
            new Field({
              name: 'atb-entrance-exam-supporter-name',
              label: 'Full Name',
              validations: text,
            }),
            new Field({
              name: 'atb-entrance-exam-supporter-address',
              label: 'Mailing Address',
              validations: text,
            }),
          ],
          [
            new Field({
              name: 'atb-entrance-exam-supporter-city',
              label: 'City',
              columnClassName: 'md-col-4',
              validations: text,
            }),
            new Field({
              name: 'atb-entrance-exam-supporter-state',
              label: 'State',
              columnClassName: 'md-col-4',
              type: 'dropdown',
              options: US_STATES,
            }),
            new Field({
              name: 'atb-entrance-exam-supporter-zip-code',
              label: 'Zip Code',
              columnClassName: 'md-col-4',
              validations: zip,
            }),
          ],
          [
            new Field({
              name: 'atb-entrance-exam-supporter-phone',
              label: 'Phone',
              validations: phone,
            }),
          ],
        ],
      }),
    ],

    [
      new Field({
        name: 'atb-remedial-program-completed',
        label: 'Did you (or the student) complete a remedial program at the school?',
        type: 'group',
        yesno: true,
        default: 'no',

        fields: [
          [
            new Field({
              name: 'atb-remedial-program-name',
              label: 'Please provide the name of the remedial program.',
              validations: text,
            }),
            {
              title: 'Provide the dates you were enroled in the program',
              type: 'group',
              fields: [
                [
                  new Field({
                    name: 'atb-remedial-program-from',
                    label: 'From',
                    type: 'date',
                    columnClassName: 'md-col-6',
                    validations: date,
                  }),
                  new Field({
                    name: 'atb-remedial-program-to',
                    label: 'To',
                    type: 'date',
                    columnClassName: 'md-col-6',
                    validations: date,
                  }),
                ],
              ],
            },
            new Field({
              name: 'atb-remedial-program-courses',
              label: 'Which courses did you take in the program?',
              type: 'text',
              validations: textMedium,
            }),
            new Field({
              name: 'atb-remedial-program-grades',
              label: 'Which grades did you earn in the program?',
              type: 'text',
              validations: textMedium,
            }),
          ],
        ],
      }),
    ],
    [
      new Field({
        name: 'atb-complete-credit',
        label:
          'Did you (or the student) successfully complete 6 credit hours or 225 clock hours of coursework that applied toward a program offered by the school before you received a Direct or a FFEL loan?',
        type: 'yesno',
        default: 'no',
        alert: {
          yes: {
            message: 'You are not eligible for this discharge',
          },
        },
      }),
    ],
  ],
};

const atbDisqualifyingForm = {
  title: 'Abitlity To Benefit - Disqualifying Status',
  fields: [
    [
      new Field({
        name: 'atbd-applying-as',
        label: 'Are you applying for this loan discharge as a parent',
        type: 'group',
        yesno: true,
        default: 'no',

        fields: [
          [
            new Field({
              name: 'atbd-student-name',
              label: 'Student name (Last, First, MI)',
              columnClassName: 'md-col-6',
              validations: text,
            }),
            new Field({
              name: 'atbd-student-ssn',
              label: 'Student SSN',
              columnClassName: 'md-col-6',
              validations: ssn,
            }),
          ],
        ],
      }),
    ],
    [
      new Field({
        name: 'atbd-program-of-study',
        label: "What was your (or the student's) program of study?",
        validations: text,
      }),
    ],
    [
      new Field({
        title:
          'You believe your loan should not be paid because of a violation of State regulations related to your:',
        type: 'group',

        fields: [
          [
            new Field({
              name: 'atbd-option1',
              type: 'checkbox',
              label: 'Age',
            }),
          ],
          [
            new Field({
              name: 'atbd-option2',
              type: 'checkbox',
              label: 'Physical Condition',
            }),
          ],
          [
            new Field({
              name: 'atbd-option3',
              type: 'checkbox',
              label: 'Mental Condition',
            }),
          ],
          [
            new Field({
              name: 'atbd-option4',
              type: 'checkbox',
              label: 'Criminal Record',
            }),
          ],
          [
            new Field({
              name: 'atbd-option5',
              type: 'checkbox',
              columnClassName: 'md-col-4',
              label: 'Other:',
            }),
            new Field({
              name: 'atbd-option5-text',
              label: 'Specify',
              columnClassName: 'md-col-8',
              validations: text,
            }),
          ],
        ],
      }),
    ],
    [
      new Field({
        name: 'atbd-law',
        label:
          'Which state law do you believe was violated by your school? Please include as much information as you can about the law, including the legal code number if you have it.',
        type: 'text',
        validations: textMedium,
      }),
    ],
    [
      new Field({
        name: 'atbd-reason-not-to-benefit',
        label:
          'Before issuing your loan, did the school ask you if there was an reason you could not benefit from your degree?',
        type: 'yesno',
        default: 'no',
        toggle: ['atbd-inform'],
      }),
    ],
    [
      new Field({
        name: 'atbd-inform',
        label:
          ' Did you inform the school of the disqualifying status before the loan was certified or originated?',
        type: 'yesno',
        default: 'no',
        hidden: false,
      }),
    ],
  ],
};

module.exports = {
  wageGarnishmentForm,
  atbDisqualifyingForm,
  taxOffsetForm,
  personalStatement,
  evidenceUploader,
  unauthorizedSignatureForm,
  atbForm,
};
