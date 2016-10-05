/* eslint max-len: 0 */

const personalInformationFieldSets = [
  {
    title: 'Personal Information',
    subtitle: 'Let’s get started',
    fields: [
      [
        {
          name: 'name',
          label: 'Your Name',
          columnClassName: 'md-col-8',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'ssn',
          label: 'Social Security Number',
          placeholder: 'AAA-GG-SSSS',
          columnClassName: 'md-col-4',
          validations: [
            'required',
            'alphaDash',
            'minLength:9',
            'maxLength:11',
          ],
        },
      ],
      [
        {
          name: 'address1',
          label: 'Your Mailing Address',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
      [
        {
          name: 'address2',
          label: 'City, State, Zip Code',
          validations: [
            'maxLength:128',
          ],
        },
      ],
      [
        {
          name: 'email',
          label: 'Your email',
          placeholder: 'you@example.com',
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'email',
            'maxLength:128',
          ],
        },
        {
          name: 'phone',
          label: 'Your telephone',
          placeholder: '(555) 555-5555',
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'maxLength:20',
          ],
        },
        {
          name: 'phone',
          label: 'Your telephone (alt.)',
          placeholder: '(555) 555-5555',
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'maxLength:20',
          ],
        },
      ],
    ],
  },
  {
    title: 'Your School',
    fields: [
      [
        {
          name: 'schoolName',
          label: 'Name of the school where you incurred the debt',
          columnClassName: 'md-col-8',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
    ],
  },
  {
    title: 'FFEL Loan',
    yesno: true,
    name: 'ffel-loan-radio-option',
    label: 'Are you a FFEL holder?',
    caption: 'If you have FFEL loans, you will need to provide the name and address of the originator of your loan. If you don’t know the name of the guarantor, you can call the Department of the Treasury and ask them for the name and address of your guarantor. Their number is: <span class="-white">1-800-304-3107</span>.',
    fields: [
      [
        {
          name: 'guarantyAgency',
          label: 'Name of Guaranty Agency',
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'guarantyAgencyMailingAddress',
          label: 'Guaranty Agency mailing address',
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
    ],
  },
  {
    title: 'Employment',
    yesno: true,
    name: 'employment-radio-option',
    label: 'Are You Currently employed?',
    fields: [
      [
        {
          name: 'employer',
          label: 'Current Employer',
          columnClassName: 'md-col-8',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'employmentDate',
          type: 'date',
          label: 'Beggining Date',
          placeholder: 'mm-dd-yyyy',
          columnClassName: 'md-col-4',
          validations: [
            'required',
            'maxLength:20',
          ],
        },
      ],
      [
        {
          name: 'employerAddress1',
          label: 'Employer Mailing Address 1',
          columnClassName: 'md-col-8',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'employerAddress2',
          label: 'Employer Mailing Address 2',
          columnClassName: 'md-col-8',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'employerPhone',
          label: 'Employer Phone',
          placeholder: '(555) 555-5555',
          columnClassName: 'md-col-4',
          validations: [
            'required',
            'maxLength:20',
          ],
        },
      ],
    ],
  },
];

const personalInformation = {
  type: 'form',
  name: 'personal-information-form',
  title: 'Personal Information',
  description: 'Here we need some personal, school and employment information.',
  fieldSets: personalInformationFieldSets,
};

const personalStatement = {
  type: 'upload',
  name: 'personal-statement-uploader',
  multiple: false,
  optional: false,
  mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 5242880,
  title: 'Personal Statement',
  description: 'In addition to providing evidence against the school, you can write a personal statement describing how your school lied to and defrauded you and upload it here.',
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

const US_STATES = require('datasets-us-states-names');

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
      {
        name: 'fc-applying-as',
        label: 'Are you applying for this discharge as a parent',
        type: 'group',
        yesno: true,
        default: 'no',
        fields: [
          [
            {
              name: 'fc-student-name',
              label: 'Student name (Last, First, MI)',
              columnClassName: 'md-col-6',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'fc-student-ssn',
              label: 'Student SSN',
              placeholder: 'AAA-GG-SSSS',
              columnClassName: 'md-col-6',
              validations: [
                'required',
                'alphaDash',
                'minLength:9',
                'maxLength:11',
              ],
            },
          ],
        ],
      },
    ],

    [
      {
        name: 'fc-school-name',
        label: 'Name of the school',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
      {
        name: 'fc-school-address',
        label: 'Mailing Address of the school',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
      {
        name: 'fc-school-address2',
        label: 'City, State, Zip Code of the school',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
      {
        title: 'Dates of attendance in school?',
        type: 'group',
        fields: [
          [
            {
              name: 'fc-attendance-from',
              label: 'From',
              type: 'date',
              columnClassName: 'md-col-6',
              validations: [
                'required',
              ],
            },
            {
              name: 'fc-attendance-to',
              label: 'To',
              type: 'date',
              columnClassName: 'md-col-6',
              validations: [
                'required',
              ],
            },
          ],
        ],
      },
    ],

    [
      {
        title: 'Which documents(s) was signed without your permission?',
        type: 'group',
        fields: [
          [
            {
              name: 'fc-documents-a',
              label: 'Loan Application',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'fc-documents-b',
              label: 'Promissory note',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'fc-documents-c',
              label: 'Master promissory note',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'fc-documents-d',
              label: 'Combined application/promissory node',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'fc-documents-e',
              label: 'Loan check',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'fc-documents-f',
              label: 'Electronic funds transfer authorization',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'fc-documents-g',
              label: 'Master check authorization',
              type: 'checkbox',
              validations: [
                'required',
              ],
            },
          ],
        ],
      },
    ],

    [
      {
        name: 'fc-tuition-payment',
        label: 'How did you (or the student) pay tuition and fees to attend the school?',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
      {
        name: 'fc-tuition-payment2',
        label: '',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
    ],
    [
      {
        name: 'fc-explain',
        label: 'Explain the circumstances under which the person signed your name without your permission',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
      {
        name: 'fc-explain2',
        label: '',
        validations: [
          'required',
          'maxLength:128',
        ],
      },
    ],
  ],
};

const atbForm = {
  title: 'False Certification - Ability to Benefit',
  fields: [
    [
      {
        name: 'atb-applying-as',
        label: 'Are you applying for this loan discharge as a parent',
        type: 'group',
        yesno: true,
        default: 'no',
        fields: [
          [
            {
              name: 'atb-student-name',
              label: 'Student name (Last, First, MI)',
              columnClassName: 'md-col-6',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-student-ssn',
              label: 'Student SSN',
              placeholder: 'AAA-GG-SSSS',
              columnClassName: 'md-col-6',
              validations: [
                'required',
                'alphaDash',
                'minLength:9',
                'maxLength:11',
              ],
            },
          ],
        ],
      },
    ],
    [
      {
        name: 'atb-attended-at',
        label: 'Did you (or the student) attend college prior to July 2, 2012?',
        type: 'yesno',
        default: 'yes',
        toggle: [
          'atb-attended-where',
        ],
        validations: [
          'required',
        ],
      },
      {
        name: 'atb-attended-where',
        label: 'Were you (or the student), prior to July 1, 2012, officially registered in college and scheduled to attend?',
        type: 'yesno',
        default: 'yes',
        hidden: true,
        validations: [
          'required',
        ],
        alert: {
          no: {
            message: 'Sorry, You are not eligible for this discharge.',
          },
        },
      },
    ],
    [
      {
        title: 'Provide the following information about the college where you acquired the loans you are disputing on this form.',
        type: 'group',
        fields: [
          [
            {
              name: 'atb-school-name',
              label: 'Name of the school',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-school-address',
              label: 'Mailing Address of the school',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-school-address2',
              label: 'City, State, Zip Code of the school',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-school-date',
              label: 'On what date did you (or the student) begin attending the school?',
              type: 'date',
              validations: [
                'required',
              ],
            },
          ],
        ],
      },
    ],
    [
      {
        title: 'Please list your (of the student\'s) dates of attendance at the school. Be as accurate as you can.',
        type: 'group',
        fields: [
          [
            {
              name: 'atb-attendance-from',
              label: 'From',
              type: 'date',
              columnClassName: 'md-col-6',
              validations: [
                'required',
              ],
            },
            {
              name: 'atb-attendance-to',
              label: 'To',
              type: 'date',
              columnClassName: 'md-col-6',
              validations: [
                'required',
              ],
            },
          ],
          [
            {
              name: 'atb-program-of-study',
              label: 'What was your (or the student\'s) program of study?',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
          ],
          [
            {
              name: 'atb-have-ged',
              label: 'Did you (or the student) have a high school diploma or a GED while enrolled?',
              type: 'yesno',
              default: 'no',
              alert: {
                yes: {
                  message: 'Sorry, You are not eligible for this discharge.',
                },
              },
            },
          ],
          [
            {
              name: 'atb-received-ged',
              label: 'Did you (or the student) receive a GED before completing the program?',
              type: 'yesno',
              default: 'no',
            },
          ],
          [
            {
              name: 'atb-enrolled-at',
              label: 'When did you first enroll in college?',
              type: 'date',
              columnClassName: 'md-col-6',
              validations: [
                'required',
              ],
            },
          ],
        ],
      },
    ],

    // PAGE 2

    [
      {
        name: 'atb-entrance-exam',
        label: 'Before you (or the student) enrolled in the college, were you given an entrance exam?',
        type: 'group',
        yesno: true,
        default: 'no',
        fields: [
          [
            {
              name: 'atb-entrance-exam-date',
              label: 'Give the date you took the test if you know it',
              placeholder: 'YYYY-MM-DD or I don\'t know',
              validations: [
                'required',
                'maxLength:24',
              ],
            },
          ],
          [
            {
              name: 'atb-entrance-exam-name',
              label: 'Give the name of the test if you know it',
              placeholder: 'Name or I don\'t know',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
          ],
          [
            {
              name: 'atb-entrance-exam-score',
              label: 'Give the score of the test if you know it',
              placeholder: 'Score or I don\'t know',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
          ],
        ],
      },
      {
        name: 'atb-entrance-exam-improper',
        label: 'Did anything appear improper about the way the test was given?',
        type: 'group',
        yesno: true,
        default: 'no',
        fields: [
          [
            {
              name: 'atb-entrance-exam-improper-explain',
              label: 'Explain in detail what appeared improper',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
          ],
          [
            {
              name: 'atb-entrance-exam-improper-explain2',
              label: '',
              validations: [
                'maxLength:128',
              ],
            },
          ],
        ],
      },
    ],
    [
      {
        title: 'Can anyone support the statement that the test was not given properly?',
        subtitle: 'Please provide a name, address, and phone number for that person.',
        type: 'group',
        yesno: true,
        name: 'atb-entrance-exam-radio-option',
        default: 'no',
        fields: [
          [
            {
              name: 'atb-entrance-exam-supporter-name',
              label: 'Full Name',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-entrance-exam-supporter-address',
              label: 'Mailing Address',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-entrance-exam-supporter-address2',
              label: 'City, State, Zip Code',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-entrance-exam-supporter-phone',
              label: 'Phone',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
          ],
        ],
      },
    ],

    [
      {
        name: 'atb-remedial-program-completed',
        label: 'Did you (or the student) complete a remedial program at the school?',
        type: 'group',
        yesno: true,
        default: 'no',
        fields: [
          [
            {
              name: 'atb-remedial-program-name',
              label: 'Please provide the name of the remedial program.',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              title: 'Provide the dates you were enroled in the program',
              type: 'group',
              fields: [
                [
                  {
                    name: 'atb-remedial-program-from',
                    label: 'From',
                    type: 'date',
                    columnClassName: 'md-col-6',
                    validations: [
                      'required',
                    ],
                  },
                  {
                    name: 'atb-remedial-program-to',
                    label: 'To',
                    type: 'date',
                    columnClassName: 'md-col-6',
                    validations: [
                      'required',
                    ],
                  },
                ],
              ],
            },
            {
              name: 'atb-remedial-program-courses',
              label: 'Which courses did you take in the program?',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-remedial-program-courses2',
              label: '',
              validations: [
                'maxLength:128',
              ],
            },
            {
              name: 'atb-remedial-program-grades',
              label: 'Which grades did you earn in the program?',
              validations: [
                'required',
                'maxLength:128',
              ],
            },
            {
              name: 'atb-remedial-program-grades2',
              label: '',
              validations: [
                'maxLength:128',
              ],
            },
          ],
        ],
      },
    ],
    [
      {
        name: 'atb-complete-credit',
        label: 'Did you (or the student) successfully complete 6 credit hours or 225 clock hours of coursework that applied toward a program offered by the school before you received a Direct or a FFEL loan?',
        type: 'yesno',
        default: 'no',
        alert: {
          yes: {
            message: 'You are not eligible for this discharge',
          },
        },
        validations: [
          'required',
        ],
      },
    ],
  ],
};

module.exports = {
  personalInformation,
  personalStatement,
  evidenceUploader,
  US_STATES,
  LOAN_SERVICERS,
  CORINTHIAN_SCHOOLS,
  unauthorizedSignatureForm,
  atbForm,
};
