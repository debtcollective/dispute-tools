/* eslint max-len: 0 */

const SMALLER_FONT_SIZE = '26';
const SMALL_FONT_SIZE = '30';
const NORMAL_FONT_SIZE = '42';
const BIG_FONT_SIZE = '48';

const formatDate = date =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

const { US_STATES } = require('..');

const Field = require('./validations');

const {
  zip,
  email,
  ssn,
  phone,
  text,
  date,
  textMedium,
} = Field.FieldValidation;

const personalInformationFieldSets = [
  {
    title: 'Personal Information',
    subtitle: 'Let’s get started',
    fields: [
      [
        new Field({
          name: 'name',
          label: 'Your Name',
          columnClassName: 'md-col-8',
          validations: text,
        }),
        new Field({
          name: 'ssn',
          label: 'Social Security Number',
          columnClassName: 'md-col-4',
          validations: ssn,
        }),
      ],
      [
        new Field({
          name: 'address1',
          label: 'Your Mailing Address',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'city',
          label: 'Your City',
          columnClassName: 'md-col-5',
          validations: text,
        }),
        new Field({
          name: 'state',
          label: 'Your State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
        }),
        new Field({
          name: 'zip-code',
          label: 'Your Zip Code',
          columnClassName: 'md-col-3',
          validations: zip,
        }),
      ],
      [
        new Field({
          name: 'email',
          label: 'Your email',
          columnClassName: 'md-col-6',
          validations: email,
        }),
        new Field({
          name: 'phone',
          label: 'Your telephone',
          columnClassName: 'md-col-6',
          validations: phone,
        }),
        new Field({
          name: 'phone2',
          label: 'Your telephone (alt.) testst',
          columnClassName: 'md-col-6',
          validations: phone,
          required: false,
        }),
      ],
    ],
  },
  {
    title: 'Your School',
    fields: [
      [
        new Field({
          name: 'schoolName',
          label: 'Name of the school where you incurred the debt',
          columnClassName: 'md-col-12',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'school-address',
          label: 'School Mailing Address',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'school-city',
          label: 'School City',
          columnClassName: 'md-col-5',
          validations: text,
        }),
        new Field({
          name: 'school-state',
          label: 'School State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
        }),
        new Field({
          name: 'school-zip-code',
          label: 'School Zip Code',
          columnClassName: 'md-col-3',
          validations: zip,
        }),
      ],
      [
        {
          subtitle: 'When did you attend the school?',
          type: 'group',
          fields: [
            [
              new Field({
                name: 'school-attended-from',
                label: 'From',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: date,
              }),
              new Field({
                name: 'school-attended-to',
                label: 'To',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: date,
              }),
            ],
          ],
        },
      ],
    ],
  },
  new Field({
    title: 'FFEL Loan',
    yesno: true,
    name: 'ffel-loan-radio-option',

    label: 'Are you a FFEL holder?',
    caption:
      'If you have FFEL loans, you will need to provide the name and address of the originator of your loan. If you don’t know the name of the guarantor, you can call the Department of the Treasury and ask them for the name and address of your guarantor. Their number is: <span class="-white">1-800-304-3107</span>.',
    fields: [
      [
        new Field({
          name: 'guarantyAgency',
          label: 'Name of Guaranty Agency',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'guarantyAgencyMailingAddress',
          label: 'Guaranty Agency mailing address',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'guarantyAgencyCity',
          label: 'Guaranty Agency City',
          columnClassName: 'md-col-4',
          validations: text,
        }),
        new Field({
          name: 'guarantyAgencyState',
          label: 'Guaranty Agency State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
        }),
        new Field({
          name: 'guarantyAgencyZipCode',
          label: 'Guaranty Agency Zip Code',
          columnClassName: 'md-col-4',
          validations: zip,
        }),
      ],
    ],
  }),
  new Field({
    title: 'Employment',
    yesno: true,
    name: 'employment-radio-option',
    label: 'Are You Currently employed?',

    fields: [
      [
        new Field({
          name: 'employer',
          label: 'Current Employer',
          columnClassName: 'md-col-8',
          validations: text,
        }),
        new Field({
          name: 'employmentDate',
          type: 'date',
          label: 'Beginning Date',
          validations: date,
          columnClassName: 'md-col-4',
        }),
      ],
      [
        new Field({
          name: 'employerAddress1',
          label: 'Employer Mailing Address 1',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'employerCity',
          label: 'Employer City',
          columnClassName: 'md-col-4',
          validations: text,
        }),
        new Field({
          name: 'employerState',
          label: 'Employer State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
        }),
        new Field({
          name: 'employerZipCode',
          label: 'Employer Zip Code',
          columnClassName: 'md-col-4',
          validations: zip,
        }),
      ],
      [
        new Field({
          name: 'employerPhone',
          label: 'Employer Phone',
          validations: phone,
        }),
      ],
    ],
  }),
];

const personalInformation = {
  type: 'form',
  name: 'personal-information-form',
  title: 'Personal Information',
  description: 'Here we need some personal, school and employment information.',
  fieldSets: personalInformationFieldSets,
};

const personalInformationFieldSetsForTax = [
  {
    title: 'Personal Information',
    subtitle: 'Let’s get started',
    fields: [
      [
        new Field({
          name: 'name test',
          label: 'Your Name',
          columnClassName: 'md-col-8',
          validations: text,
        }),
        new Field({
          name: 'ssn',
          label: 'Social Security Number',
          columnClassName: 'md-col-4',
          validations: ssn,
        }),
      ],
      [
        new Field({
          name: 'address1',
          label: 'Your Mailing Address',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'city',
          label: 'Your City',
          columnClassName: 'md-col-5',
          validations: text,
        }),
        new Field({
          name: 'state',
          label: 'Your State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
        }),
        new Field({
          name: 'zip-code',
          label: 'Your Zip Code',
          columnClassName: 'md-col-3',
          validations: zip,
        }),
      ],
      [
        new Field({
          name: 'email',
          label: 'Your email',
          columnClassName: 'md-col-6',
          validations: email,
        }),
        new Field({
          name: 'phone',
          label: 'Your telephone',
          columnClassName: 'md-col-6',
          validations: phone,
        }),
        new Field({
          name: 'phone2',
          label: 'Your telephone (alt.)',
          columnClassName: 'md-col-6',
          validations: phone,
          required: false,
        }),
      ],
    ],
  },
  {
    title: 'Your School',
    fields: [
      [
        new Field({
          name: 'schoolName',
          label: 'Name of the school where you incurred the debt',
          columnClassName: 'md-col-12',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'school-address',
          label: 'School Mailing Address',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'school-city',
          label: 'School City',
          columnClassName: 'md-col-5',
          validations: text,
        }),
        new Field({
          name: 'school-state',
          label: 'School State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
        }),
        new Field({
          name: 'school-zip-code',
          label: 'School Zip Code',
          columnClassName: 'md-col-3',
          validations: zip,
        }),
      ],
      [
        {
          subtitle: 'When did you attend the school?',
          type: 'group',
          fields: [
            [
              new Field({
                name: 'school-attended-from',
                label: 'From',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: date,
              }),
              new Field({
                name: 'school-attended-to',
                label: 'To',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: date,
              }),
            ],
          ],
        },
      ],
    ],
  },
];

const personalInformationForTax = {
  type: 'form',
  name: 'personal-information-form',
  title: 'Personal Information',
  description: 'Here we need some personal information.',
  fieldSets: personalInformationFieldSetsForTax,
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
  optional: true,
  mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 5242880,
  title: 'Evidence',
  description: 'Complement your case by attaching any supporting documents.',
  uploadButtonText: 'Upload files',
  footerNotes: 'JPEG, PNG, PDF format',
};

const LOAN_SERVICERS = [
  'Aspire Resources',
  'CornerStone',
  'ESA/EdFinancial',
  'FedLoan Servicing',
  'Granite State',
  'Great Lakes',
  'MOHELA',
  'Navient/Sallie Mae',
  'Nelnet',
  'OSLA',
  'VSAC',
  'ECMC',
  'AES',
  'Other',
  'I don’t know',
];

const CORINTHIAN_SCHOOLS = [
  'Everest Jonesboro',
  'Everest Mesa',
  'Everest Phoenix',
  'Everest ONLINE - Phoenix',
  'Everest ONLINE - Tempe',
  'Everest Alhambra',
  'Everest Anaheim',
  'Everest City of Industry',
  'Heald Concord',
  'Heald Folsom',
  'WyoTech Fremont',
  'Heald Fresno',
  'Everest Gardena',
  'Heald Hayward',
  'Everest Hayward',
  'WyoTech Long Beach',
  'Everest Los Angeles',
  'Heald Modesto',
  'Everest Ontario - Metro',
  'Everest Ontario',
  'Heald Rancho Cordova',
  'Everest Reseda',
  'Heald Roseville',
  'Wyotech Sacramento (West)',
  'Heald Salinas',
  'Everest San Bernardino',
  'Heald San Francisco',
  'Heald San Jose',
  'Everest San Jose',
  'Everest Santa Ana',
  'Heald Stockton',
  'Everest Torrance',
  'Everest Aurora',
  'Everest Colorado Springs',
  'Everest Thornton',
  'Everest Brandon',
  'WyoTech Daytona Beach',
  'Everest ONLINE - Brandon',
  'Everest Jacksonville',
  'Everest Kendall*',
  'Everest Lakeland',
  'Everest Largo (formerly FMU)',
  'Everest Melbourne',
  'Everest North Miami*',
  'Everest Orange Park',
  'Everest Orlando North',
  'Everest Orlando South',
  'Everest  ONLINE - Orlando South',
  'Everest Pinellas (Largo)',
  'Everest Pompano Beach',
  'Everest ONLINE - Pompano',
  'Everest Tampa',
  'Everest ONLINE - Tampa',
  'Everest Decatur',
  'Everest Atlanta Greenbriar',
  'Everest  Jonesboro',
  'Everest Marietta',
  'Everest Norcross',
  'Heald Honolulu',
  'Everest Bedford Park',
  'Everest  Chicago',
  'Everest Burr Ridge',
  'Everest Melrose Park',
  'Everest Merrionette',
  'Everest North Aurora**',
  'Everest Skokie',
  'Everest Merrillville',
  'Everest Brighton**',
  'Everest Chelsea',
  'Everest Silver Spring',
  'Everest Dearborn',
  'Everest Detroit',
  'Everest Grand Rapids',
  'Everest Kalamazoo',
  'Everest Southfield',
  'Everest Eagan',
  'Everest Kansas City (MO)',
  'Everest Springfield',
  'Everest St Louis',
  'Everest South Plainfield',
  'Everest Henderson',
  'Everest Rochester',
  'Everest Columbus/Gahanna',
  'Everest Portland',
  'Everest Tigard',
  'Heald Portland',
  'Everest Ben Salem',
  'WyoTech Blairsville',
  'Everest Pittsburgh',
  'Everest Arlington',
  'Everest Austin',
  'Everest Bissonet',
  'Everest Dallas',
  'Everest Ft Worth II',
  'Everest Fort Worth North',
  'Everest Greenspoint',
  'Everest Houston Hobby',
  'Everest San Antonio',
  'Everest Salt Lake City',
  'Everest Chesapeake',
  'Everest Newport News',
  'Everest Tyson’s Corner aka Vienna',
  'Everest Bremerton',
  'Everest Everett',
  'Everest Renton',
  'Everest Seattle',
  'Everest Tacoma',
  'Everest Milwaukee',
  'Everest Cross Lanes',
  'WyoTech Laramie',
  'Everest Vancouver',
  'Everest Woodbridge DC',
];

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
        label:
          'How did you (or the student) pay tuition and fees to attend the school?',
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
        label:
          'On what date did you (or the student) begin attending the school?',
        type: 'date',
      }),
    ],
    [
      new Field({
        name: 'atb-program-of-study',
        label: "What was your (or the student's) program of study?",
      }),
    ],
    [
      new Field({
        name: 'atb-have-ged',
        label:
          'Did you (or the student) have a high school diploma or a GED while enrolled?',
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
        label:
          'Did you (or the student) receive a GED before completing the program?',
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
        title:
          'Can anyone support the statement that the test was not given properly?',
        subtitle:
          'Please provide a name, address, and phone number for that person.',
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
        label:
          'Did you (or the student) complete a remedial program at the school?',
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

const wageGarnishmentDocument = {
  templates: [
    {
      path: '/lib/assets/document_templates/wage_garnishment/0.png',

      fields: {
        'personal-information-form.name': {
          x: 522,
          y: 500,
        },
        'personal-information-form.ssn': {
          x: 1862,
          y: 500,
        },
        'personal-information-form.address1': {
          x: 522,
          y: 572,
        },
        address2(template, data) {
          const personalInformationForm =
            data.forms['personal-information-form'];

          // Old records will have address2 field
          let { address2 } = personalInformationForm;

          // New records will have city, state and zip fields
          if (!address2) {
            const { city, state } = personalInformationForm;
            const zip = personalInformationForm['zip-code'];
            address2 = `${city}, ${state} ${zip}`;
          }

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(522, 644, address2);
        },
        'personal-information-form.phone': {
          x: 522,
          y: 716,
        },
        'personal-information-form.employer': {
          x: 522,
          y: 784,
        },
        'personal-information-form.employerAddress1': {
          x: 680,
          y: 858,
        },
        employerAddress2(template, data) {
          const personalInformationForm =
            data.forms['personal-information-form'];

          // Old records will have employerAddress2 field
          let { employerAddress2 } = personalInformationForm;

          // New records will have employerCity, employerState and employerZipCode fields
          if (!employerAddress2) {
            const city = personalInformationForm.employerCity;
            const state = personalInformationForm.employerState;
            const zip = personalInformationForm.employerZipCode;

            employerAddress2 = `${city}, ${state} ${zip}`;
          }

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(680, 932, employerAddress2);
        },
        'personal-information-form.employerPhone': {
          x: 680,
          y: 1004,
        },
        'personal-information-form.employmentDate': {
          x: 1170,
          y: 1076,
        },
        process(template, data) {
          const w = 295;
          let h;

          const option = parseInt(data.disputeProcess, 10);

          switch (option) {
            case 1:
              h = 2250;
              break;
            case 2:
              h = 2390;
              break;
            case 3:
              h = 2720;
              break;
            default:
              break;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(w, h, 'P');

          if (option === 2 && data.disputeProcessCity) {
            const _y = 2558;
            let _x;

            switch (data.disputeProcessCity) {
              case 'Atlanta':
                _x = 1176;
                break;
              case 'Chicago':
                _x = 1518;
                break;
              case 'San Francisco':
                _x = 1858;
                break;
              default:
                break;
            }

            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(_x, _y, 'P');
          }
        },
      },
    },
    {
      path: '/lib/assets/document_templates/wage_garnishment/1.png',
      fields: {
        optionA(template, data) {
          if (data.option === 'A') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(356, 1516, 'P');
          }
        },
      },
    },
    {
      path: '/lib/assets/document_templates/wage_garnishment/2.png',
      fields: {
        date(template) {
          const date = new Date();

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(440, 2354, formatDate(date));
        },
        signature(template, data) {
          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(982, 2354, data.signature);
        },
        optionB(template, data) {
          if (data.option === 'B') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(386, 810, 'P');
          }
        },

        optionC(template, data) {
          if (data.option === 'C') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(356, 1020, 'P');
          }
        },

        optionD(template, data) {
          if (data.option === 'D') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(386, 1340, 'P')
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(
                304,
                1390,
                data.forms['personal-information-form'].schoolName,
              );
          }
        },

        optionE(template, data) {
          if (data.option === 'E') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(386, 1880, 'P')
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(
                686,
                1880,
                data.forms['personal-information-form'].schoolName,
              );
          }
        },
      },
    },
    {
      path: '/lib/assets/document_templates/wage_garnishment/3.png',
      fields: {},
    },
    {
      path: '/lib/assets/document_templates/wage_garnishment/4.png',
      fields: {},
    },
    {
      path: '/lib/assets/document_templates/wage_garnishment/5.png',
      fields: {},
    },
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
  SMALLER_FONT_SIZE,
  SMALL_FONT_SIZE,
  NORMAL_FONT_SIZE,
  BIG_FONT_SIZE,
  US_STATES,
  LOAN_SERVICERS,
  CORINTHIAN_SCHOOLS,
  formatDate,
  personalInformation,
  personalInformationForTax,
  personalStatement,
  evidenceUploader,
  unauthorizedSignatureForm,
  atbForm,
  wageGarnishmentDocument,
  atbDisqualifyingForm,
};
