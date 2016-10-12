/* eslint max-len: 0 */

const SMALL_FONT_SIZE = '22';
const NORMAL_FONT_SIZE = '42';
const BIG_FONT_SIZE = '48';

const normalizeSSN = (ssn) => {
  ssn = ssn.split('-').join('').split('_').join('');

  const result = [];

  result.push(ssn.substr(0, 3));
  result.push(ssn.substr(3, 2));
  result.push(ssn.substr(5, 4));

  return result;
};

const formatDate = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const textToParagraphs = (text) => {
  const maxLength = 128;
  let firstParagraph;
  let secondParagraph;

  if (text.length > maxLength) {
    firstParagraph = text.substr(0, maxLength);
    const lastTrimmedSpace = Math.min(firstParagraph.length, firstParagraph.lastIndexOf(' '));

    firstParagraph = firstParagraph.substr(0, lastTrimmedSpace);

    secondParagraph = text.substr(lastTrimmedSpace, text.length);
  } else {
    firstParagraph = text;
    secondParagraph = '';
  }

  return {
    firstParagraph,
    secondParagraph,
  };
};

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
          attributes: { placeholder: 'AAA-GG-SSSS' },
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
          attributes: { placeholder: 'you@example.com' },
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
          attributes: { placeholder: '(555) 555-5555' },
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'maxLength:20',
          ],
        },
        {
          name: 'phone2',
          label: 'Your telephone (alt.)',
          attributes: { placeholder: '(555) 555-5555' },
          columnClassName: 'md-col-6',
          validations: [
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
          columnClassName: 'md-col-12',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
      [
        {
          name: 'school-address',
          label: 'Mailing Address of the school',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'school-address2',
          label: 'City, State, Zip Code of the school',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
      [
        {
          subtitle: 'When did you attended the school?',
          type: 'group',
          fields: [
            [
              {
                name: 'school-attended-from',
                label: 'From',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: [
                  'required',
                ],
              },
              {
                name: 'school-attended-to',
                label: 'To',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: [
                  'required',
                ],
              },
            ],
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
          attributes: { placeholder: 'mm-dd-yyyy' },
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
          label: 'Employer City, State, Zip Code',
          columnClassName: 'md-col-8',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'employerPhone',
          label: 'Employer Phone',
          attributes: { placeholder: '(555) 555-5555' },
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

const personalInformationFieldSetsForTax = [
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
          attributes: { placeholder: 'AAA-GG-SSSS' },
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
          attributes: { placeholder: 'you@example.com' },
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
          attributes: { placeholder: '(555) 555-5555' },
          columnClassName: 'md-col-6',
          validations: [
            'required',
            'maxLength:20',
          ],
        },
        {
          name: 'phone2',
          label: 'Your telephone (alt.)',
          attributes: { placeholder: '(555) 555-5555' },
          columnClassName: 'md-col-6',
          validations: [
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
          columnClassName: 'md-col-12',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
      [
        {
          name: 'school-address',
          label: 'Mailing Address of the school',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
        {
          name: 'school-address2',
          label: 'City, State, Zip Code of the school',
          validations: [
            'required',
            'maxLength:128',
          ],
        },
      ],
      [
        {
          subtitle: 'When did you attended the school?',
          type: 'group',
          fields: [
            [
              {
                name: 'school-attended-from',
                label: 'From',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: [
                  'required',
                ],
              },
              {
                name: 'school-attended-to',
                label: 'To',
                columnClassName: 'md-col-6',
                type: 'date',
                validations: [
                  'required',
                ],
              },
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
              attributes: { placeholder: 'AAA-GG-SSSS' },
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
        type: 'text',
        attributes: {
          maxLength: 300,
        },
        validations: [
          'required',
          'maxLength:300',
        ],
      },
    ],
    [
      {
        name: 'fc-explain',
        label: 'Explain the circumstances under which the person signed your name without your permission',
        type: 'text',
        attributes: {
          maxlength: 300,
        },
        validations: [
          'required',
          'maxLength:300',
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
              attributes: { placeholder: 'AAA-GG-SSSS' },
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
    // PAGE 2
    [
      {
        name: 'atb-school-date',
        label: 'On what date did you (or the student) begin attending the school?',
        type: 'date',
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
              attributes: { placeholder: 'YYYY-MM-DD or I don\'t know' },
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
              attributes: { placeholder: 'Name or I don\'t know' },
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
              attributes: { placeholder: 'Score or I don\'t know' },
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
              type: 'text',
              attributes: {
                maxlength: 300,
              },
              validations: [
                'required',
                'maxLength:300',
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
              type: 'text',
              attributes: {
                maxlength: 300,
              },
              validations: [
                'required',
                'maxLength:300',
              ],
            },
            {
              name: 'atb-remedial-program-grades',
              label: 'Which grades did you earn in the program?',
              type: 'text',
              attributes: {
                maxlength: 300,
              },
              validations: [
                'required',
                'maxLength:300',
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
        'personal-information-form.address2': {
          x: 522,
          y: 644,
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
        'personal-information-form.employerAddress2': {
          x: 680,
          y: 932,
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
      fields: {},
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

const atbDocument = {
  templates: [
    {
      path: '/lib/assets/document_templates/falsecert_ability_to_benefit/0.png',

      fields: {
        ssn(template, data) {
          const result = normalizeSSN(data
            .forms['personal-information-form'].ssn);

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1434, 784, result[0])
            .drawText(1640, 784, result[1])
            .drawText(1788, 784, result[2]);
        },
        'personal-information-form.name': {
          x: 1430,
          y: 866,
        },
        'personal-information-form.address1': {
          x: 1430,
          y: 944,
        },
        'personal-information-form.address2': {
          x: 1430,
          y: 1016,
        },
        'personal-information-form.phone': {
          x: 1430,
          y: 1094,
        },
        'personal-information-form.phone2': {
          x: 1430,
          y: 1168,
        },
        'personal-information-form.email': {
          x: 1430,
          y: 1244,
        },
        /*
          ATB FORM
        */
        atbApplyingAs(template, data) {
          const value = data.forms['personal-information-form']['atb-applying-as'];

          const x = 233;
          let y = 1468;

          if (value === 'yes') {
            y = 1520;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        atbStudentName(template, data) {
          const check = data.forms['personal-information-form']['atb-applying-as'];

          if (check === 'yes') {
            const value = data.forms['personal-information-form']['atb-student-name'];

            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(227, 1640, value);
          }
        },
        atbStudentSsn(template, data) {
          const check = data.forms['personal-information-form']['atb-applying-as'];

          if (check === 'yes') {
            const result = normalizeSSN(data
              .forms['personal-information-form']['atb-student-ssn']);

            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(242, 1766, result[0])
              .drawText(436, 1766, result[1])
              .drawText(586, 1766, result[2]);
          }
        },
        atbAttendedAt(template, data) {
          const value = data.forms['personal-information-form']['atb-attended-at'];

          const x = 233;
          let y = 2026;

          if (value === 'yes') {
            y = 1978;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        atbAttendedWhere(template, data) {
          const value = data.forms['personal-information-form']['atb-attended-where'];

          const x = 233;
          let y = 2308;

          if (value === 'yes') {
            y = 2256;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        schoolName(template, data) {
          const schoolName = data.forms['personal-information-form'].schoolName;

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(308, 2568, schoolName);
        },
        schoolAddress(template, data) {
          const address = data.forms['personal-information-form']['school-address'];
          const address2 = data.forms['personal-information-form']['school-address2'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(308, 2696, address)
            .drawText(308, 2744, address2);
        },

        atbSchoolDate(template, data) {
          const value = data.forms['personal-information-form']['atb-school-date'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(233, 2992, formatDate(new Date(value)));
        },
        atbNumberEight(template) {
          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(1408, 1592, 'P');
        },
        schoolFrom(template, data) {
          const value = data.forms['personal-information-form']['school-attended-from'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1410, 2068, formatDate(new Date(value)));
        },
        schoolTo(template, data) {
          const value = data.forms['personal-information-form']['school-attended-to'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1802, 2068, formatDate(new Date(value)));
        },
        'personal-information-form.atb-program-of-study': {
          x: 1410,
          y: 2368,
        },
        atbHaveGED(template, data) {
          const value = data.forms['personal-information-form']['atb-have-ged'];

          const x = 1408;
          let y = 2668;

          if (value === 'yes') {
            y = 2620;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        atbReceivedGED(template, data) {
          const value = data.forms['personal-information-form']['atb-received-ged'];

          const y = 2868;
          let x = 1612;

          if (value === 'yes') {
            x = 1408;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        enrolledAt(template, data) {
          const value = data.forms['personal-information-form']['atb-enrolled-at'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1410, 2992, formatDate(new Date(value)));
        },
      },
    },
    {
      path: '/lib/assets/document_templates/falsecert_ability_to_benefit/1.png',
      fields: {
        atbEntranceExam(template, data) {
          const value = data.forms['personal-information-form']['atb-entrance-exam'];

          const x = 257;
          let y = 602;

          if (value === 'yes') {
            y = 550;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        'personal-information-form.atb-entrance-exam-date': {
          x: 252,
          y: 768,
        },
        'personal-information-form.atb-entrance-exam-name': {
          x: 252,
          y: 894,
        },
        'personal-information-form.atb-entrance-exam-score': {
          x: 252,
          y: 1020,
        },

        atbEntranceExamImproper(template, data) {
          const value =
           data.forms['personal-information-form']['atb-entrance-exam-improper'];

          const x = 257;
          let y = 1270;

          if (value === 'yes') {
            y = 1218;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },

        explain(template, data) {
          const text = data.forms['personal-information-form']['atb-entrance-exam-improper-explain'];

          const {
            firstParagraph,
            secondParagraph,
          } = textToParagraphs(text || '');

          template
            .font('Arial')
            .fontSize(SMALL_FONT_SIZE)
            .drawText(252, 1394, firstParagraph)
            .fontSize(SMALL_FONT_SIZE)
            .drawText(252, 1442, secondParagraph);
        },

        'personal-information-form.atb-entrance-exam-supporter-name': {
          x: 476,
          y: 1644,
        },
        'personal-information-form.atb-entrance-exam-supporter-address': {
          x: 328,
          y: 1768,
        },
        'personal-information-form.atb-entrance-exam-supporter-address2': {
          x: 328,
          y: 1820,
        },
        'personal-information-form.atb-entrance-exam-supporter-phone': {
          x: 328,
          y: 1944,
        },

        atbRemedialProgramCompleted(template, data) {
          const value =
           data.forms['personal-information-form']['atb-remedial-program-completed'];

          const x = 257;
          let y = 2242;

          if (value === 'yes') {
            y = 2196;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        'personal-information-form.atb-remedial-program-name': {
          x: 258,
          y: 2416,
        },
        'personal-information-form.atb-remedial-program-from': {
          x: 258,
          y: 2544,
        },
        'personal-information-form.atb-remedial-program-to': {
          x: 652,
          y: 2544,
        },

        courses(template, data) {
          const text = data.forms['personal-information-form']['atb-remedial-program-courses'];

          const {
            firstParagraph,
            secondParagraph,
          } = textToParagraphs(text || '');

          template
            .font('Arial')
            .fontSize(SMALL_FONT_SIZE)
            .drawText(258, 2670, firstParagraph)
            .drawText(258, 2718, secondParagraph);
        },

        grades(template, data) {
          const text = data.forms['personal-information-form']['atb-remedial-program-grades'];

          const {
            firstParagraph,
            secondParagraph,
          } = textToParagraphs(text || '');

          template
            .font('Arial')
            .fontSize(SMALL_FONT_SIZE)
            .drawText(258, 2842, firstParagraph)
            .drawText(258, 2892, secondParagraph);
        },

        atbCompleteCredit(template, data) {
          const value =
           data.forms['personal-information-form']['atb-complete-credit'];

          const x = 1402;
          let y = 694;

          if (value === 'yes') {
            y = 642;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },

        _29(template) {
          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(1412, 1044, 'P');
        },
        _32(template) {
          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(1412, 1830, 'P');
        },
      },
    },
    {
      path: '/lib/assets/document_templates/falsecert_ability_to_benefit/2.png',
      fields: {
        signature(template, data) {
          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(580, 1116, data.signature);

          const date = new Date();

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1852, 1116, formatDate(date));
        },
      },
    },
    {
      path: '/lib/assets/document_templates/falsecert_ability_to_benefit/3.png',
      fields: {},
    },
    {
      path: '/lib/assets/document_templates/falsecert_ability_to_benefit/4.png',
      fields: {},
    },

  ],
};

const unauthorizedSignatureDocument = {
  templates: [
    {
      path: '/lib/assets/document_templates/unauthorized_signature_form/0.png',
      fields: {
        ssn(template, data) {
          const result = normalizeSSN(data
            .forms['personal-information-form'].ssn);

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1434, 784, result[0])
            .drawText(1640, 784, result[1])
            .drawText(1788, 784, result[2]);
        },
        'personal-information-form.name': {
          x: 1430,
          y: 866,
        },
        'personal-information-form.address1': {
          x: 1430,
          y: 944,
        },
        'personal-information-form.address2': {
          x: 1430,
          y: 1016,
        },
        'personal-information-form.phone': {
          x: 1430,
          y: 1094,
        },
        'personal-information-form.phone2': {
          x: 1430,
          y: 1168,
        },
        'personal-information-form.email': {
          x: 1430,
          y: 1244,
        },

        // FC FORM
        atbApplyingAs(template, data) {
          const value = data.forms['personal-information-form']['fc-applying-as'];

          const x = 316;
          let y = 1560;

          if (value === 'yes') {
            y = 1610;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');
        },
        atbStudentName(template, data) {
          const check = data.forms['personal-information-form']['fc-applying-as'];

          if (check === 'yes') {
            const value = data.forms['personal-information-form']['fc-student-name'];

            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(300, 1766, value);
          }
        },
        atbStudentSsn(template, data) {
          const check = data.forms['personal-information-form']['fc-applying-as'];

          if (check === 'yes') {
            const result = normalizeSSN(data
              .forms['personal-information-form']['fc-student-ssn']);

            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(308, 1916, result[0])
              .drawText(514, 1916, result[1])
              .drawText(662, 1916, result[2]);
          }
        },
        schoolName(template, data) {
          const schoolName = data.forms['personal-information-form'].schoolName;

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(300, 2070, schoolName);
        },
        schoolAddress(template, data) {
          const address = data.forms['personal-information-form']['school-address'];
          const address2 = data.forms['personal-information-form']['school-address2'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(300, 2218, address)
            .drawText(300, 2268, address2);
        },
        attendanceFrom(template, data) {
          const value = data.forms['personal-information-form']['school-attended-from'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(300, 2420, formatDate(new Date(value)));
        },
        attendanceTo(template, data) {
          const value = data.forms['personal-information-form']['school-attended-to'];

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(700, 2420, formatDate(new Date(value)));
        },

        documentsA(template, data) {
          if (data.forms['personal-information-form']['fc-documents-a'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2634, 'P');
          }
        },
        documentsB(template, data) {
          if (data.forms['personal-information-form']['fc-documents-b'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2682, 'P');
          }
        },
        documentsC(template, data) {
          if (data.forms['personal-information-form']['fc-documents-c'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2734, 'P');
          }
        },
        documentsD(template, data) {
          if (data.forms['personal-information-form']['fc-documents-d'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2782, 'P');
          }
        },
        documentsE(template, data) {
          if (data.forms['personal-information-form']['fc-documents-e'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2834, 'P');
          }
        },
        documentsF(template, data) {
          if (data.forms['personal-information-form']['fc-documents-f'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2882, 'P');
          }
        },
        documentsG(template, data) {
          if (data.forms['personal-information-form']['fc-documents-g'] === 'yes') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(382, 2934, 'P');
          }
        },

        number8(template) {
          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(1414, 1832, 'P');
        },

        tuitionPayment(template, data) {
          const text = data.forms['personal-information-form']['fc-tuition-payment'];

          const {
            firstParagraph,
            secondParagraph,
          } = textToParagraphs(text || '');

          template
            .font('Arial')
            .fontSize(SMALL_FONT_SIZE)
            .drawText(1400, 2570, firstParagraph)
            .drawText(1400, 2618, secondParagraph);
        },

        number12(template) {
          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1628, 3016, 'I don\'t know');
        },
      },
    },
    {
      path: '/lib/assets/document_templates/unauthorized_signature_form/1.png',
      fields: {
        // FC PAGE 2
        fcexplain(template, data) {
          const text = data.forms['personal-information-form']['fc-explain'];

          const {
            firstParagraph,
            secondParagraph,
          } = textToParagraphs(text || '');

          template
            .font('Arial')
            .fontSize(SMALL_FONT_SIZE)
            .drawText(230, 594, firstParagraph)
            .drawText(230, 644, secondParagraph);
        },

        number14(template) {
          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(242, 1132, 'P');
        },

        number18(template) {
          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(1392, 1084, 'P');
        },

        signature(template, data) {
          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(580, 3144, data.signature);

          const date = new Date();

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1852, 3144, formatDate(date));
        },
      },
    },
    {
      path: '/lib/assets/document_templates/unauthorized_signature_form/2.png',
      fields: {},
    },
    {
      path: '/lib/assets/document_templates/unauthorized_signature_form/3.png',
      fields: {},
    },
  ],
};

const taxOffsetReviewDocument = {
  templates: [
    {
      path: '/lib/assets/document_templates/tax_offset_review/0.png',
      fields: {
        'personal-information-form.name': {
          x: 526,
          y: 390,
        },
        'personal-information-form.ssn': {
          x: 1588,
          y: 390,
        },

        address(template, data) {
          const address = `${data.forms['personal-information-form'].address1}, ${data.forms['personal-information-form'].address2}`;

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(818, 498, address);
        },

        process(template, data) {
          const x = 448;
          let y;

          const option = parseInt(data.disputeProcess, 10);

          switch (option) {
            case 1:
              y = 1306;
              break;
            case 2:
              y = 1468;
              break;
            case 3:
              y = 1742;
              break;
            default:
              break;
          }

          template
            .font('Wingdings2')
            .fontSize(BIG_FONT_SIZE)
            .drawText(x, y, 'P');

          if (option === 2) {
            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(470, 1634, data.forms['personal-information-form'].phone);
          }

          if (option === 3) {
            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(1728, 1796, data.forms['personal-information-form'].phone);
          }
        },

        option1(template, data) {
          if (data.forms['personal-information-form']['tod-section2-option'] === '1') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(436, 2176, 'P');
          }
        },
      },
    },

    {
      path: '/lib/assets/document_templates/tax_offset_review/1.png',
      fields: {
        option2(template, data) {
          if (data.forms['personal-information-form']['tod-section2-option'] === '2') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(436, 552, 'P');
          }
        },
        option3(template, data) {
          if (data.forms['personal-information-form']['tod-section2-option'] === '3') {
            const schoolName = data.forms['personal-information-form'].schoolName;
            const schoolFrom = data.forms['personal-information-form']['school-attended-from'];

            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(436, 1086, 'P');

            template
              .font('Arial')
              .fontSize(SMALL_FONT_SIZE)
              .drawText(1320, 1094, schoolName);

            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(2028, 1094, formatDate(new Date(schoolFrom)));
          }
        },
        option4(template, data) {
          if (data.forms['personal-information-form']['tod-section2-option'] === '4') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(448, 1250, 'P');

            const schoolName = data.forms['personal-information-form'].schoolName;

            template
              .font('Arial')
              .fontSize(SMALL_FONT_SIZE)
              .drawText(1534, 1260, schoolName);
          }
        },
        option5(template, data) {
          if (data.forms['personal-information-form']['tod-section2-option'] === '5') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(448, 1466, 'P');

            const schoolName = data.forms['personal-information-form'].schoolName;

            template
              .font('Arial')
              .fontSize(SMALL_FONT_SIZE)
              .drawText(1510, 1474, schoolName);
          }
        },
        option6(template, data) {
          if (data.forms['personal-information-form']['tod-section2-option'] === '6') {
            template
              .font('Wingdings2')
              .fontSize(BIG_FONT_SIZE)
              .drawText(448, 1678, 'P');

            const schoolName = data.forms['personal-information-form'].schoolName;

            template
              .font('Arial')
              .fontSize(SMALL_FONT_SIZE)
              .drawText(734, 1690, schoolName);
          }
        },

        objection(template, data) {
          const option = parseInt(data.disputeProcess, 10);

          if (option === 2 || option === 3) {
            let objection;

            if (data.forms['personal-information-form']['tod-section2-option'] === '1') {
              objection = '1';
            }

            if (data.forms['personal-information-form']['tod-section2-option'] === '2') {
              objection = '7';
            }

            if (data.forms['personal-information-form']['tod-section2-option'] === '3') {
              objection = '9';
            }

            if (data.forms['personal-information-form']['tod-section2-option'] === '4') {
              objection = '10';
            }

            if (data.forms['personal-information-form']['tod-section2-option'] === '5') {
              objection = '11';
            }

            if (data.forms['personal-information-form']['tod-section2-option'] === '6') {
              objection = '12';
            }

            template
              .font('Arial')
              .fontSize(NORMAL_FONT_SIZE)
              .drawText(470, 2498, objection)
              .drawText(382, 3112, 'I am requesting an in-person or telephone hearing because there are additional facts that I believe can \nonly be described in person or by phone.');
          }
        },
        signature(template, data) {
          const date = new Date();

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(486, 2984, formatDate(date));

          template
            .font('Arial')
            .fontSize(NORMAL_FONT_SIZE)
            .drawText(1224, 2984, data.signature);
        },
      },
    },
  ],
};

module.exports = {
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
  atbDocument,
  unauthorizedSignatureDocument,
  taxOffsetReviewDocument,
};
