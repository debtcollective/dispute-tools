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
          label: 'Your Mailing Address 2',
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
    yesNoLabel: 'Are you a FFEL holder?',
    yesNoCaption: 'If you have FFEL loans, you will need to provide the name and address of the originator of your loan. If you don’t know the name of the guarantor, you can call the Department of the Treasury and ask them for the name and address of your guarantor. Their number is: <span class="-white">1-800-304-3107</span>.',
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
    yesNoLabel: 'Are You Currently employed?',
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


module.exports = {
  nowWhat: `
    We do not have much more information about how long the dispute process takes because online dispute tools have not been used before. By making the dispute form easier to fill out, we are helping more people dispute their debts. This is a good thing! But it could affect the time that it takes for the Department to review each case. If you don't hear a response in a timely manner, this may be cause for legal action. We are watching what happens to these disputes very closely. And will we will prompt you to let us know what happens in your case so we can work together to develop collective strategies to fight back.
    <br><br>
    We will mail your dispute to the appropriate agency as soon as possible.
  `,
  signature: 'I state under penalty of law that the statements made on this request are true and accurate to the best of my knowledge.',
  options: {
    A: {
      title: 'I do not owe the full amount I am being billed for because I repaid some or all of this debt.',
      description: 'Why do you believe you already paid this debt? Attach a detailed statement and upload any documents that prove you paid.',
      steps: [
        personalInformation,
        personalStatement,
        evidenceUploader,
      ],
    },
    B: {
      title: 'I should not have to pay this debt because I was lied to or defrauded by my school.',
      description: 'See the [[common cases]] of fraud.',
      more: `### Common causes of fraud include:

- Aggressive recruiting practices by the school
- False graduation or job placement statistics given by the school
- Overcharges
- Poor quality teaching/lack of supplies`,
      steps: [
        personalInformation,
        personalStatement,
        {
          type: 'upload',
          name: 'dtr-uploader',
          multiple: false,
          optional: true,
          mimeTypes: ['application/pdf'],
          maxFileSize: 5242880,
          title: 'Defense to Repayment',
          description: 'Attach your <a href="/dispute-tools/defence-to-repayment" target="_blank" rel="noopener noreferrer">DTR</a> If you have previously filed.',
          uploadButtonText: 'Upload file',
          footerNotes: 'PDF format',
        },
        evidenceUploader,
      ],
    },
    C: {
      title: 'I did not have a high school diploma or GED when I enrolled at the school.',
      description: 'Attach any supporting documents.',
      steps: [
        {
          type: 'form',
          name: 'personal-information-form',
          title: 'Personal Information',
          description: 'Here we need some personal, school and employment information.',
          fieldSets: [
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
                    label: 'Your Mailing Address 2',
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
                ],
              ],
            },
            {
              title: 'Employment',
              yesno: true,
              yesNoLabel: 'Are You Currently employed?',
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
            {
              title: 'False Certification - Ability to Benefit',
              fields: [
                [
                  {
                    name: 'atb-applying-as',
                    label: 'Are you applying for this loan discharge as a parent',
                    type: 'yesno',
                    default: 'no',
                    toggle: [
                      'atb-student-name',
                      'atb-student-ssn',
                    ],
                    validations: [
                      'required',
                    ],
                  },
                ],
                [
                  {
                    name: 'atb-student-name',
                    label: 'Student name (Last, First, MI)',
                    hidden: true,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'atb-student-ssn',
                    label: 'Student SSN',
                    placeholder: 'AAA-GG-SSSS',
                    hidden: true,
                    validations: [
                      'required',
                      'alphaNumericDash',
                      'minLength:9',
                      'maxLength:11',
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
                          columnClassName: 'md-col-8',
                          validations: [
                            'required',
                            'maxLength:128',
                          ],
                        },
                        {
                          name: 'atb-school-address',
                          label: 'Mailing Address of the school',
                          columnClassName: 'md-col-8',
                          validations: [
                            'required',
                            'maxLength:128',
                          ],
                        },
                        {
                          name: 'atb-school-address2',
                          label: 'City, State, Zip Code of the school',
                          columnClassName: 'md-col-8',
                          validations: [
                            'required',
                            'maxLength:128',
                          ],
                        },
                        {
                          name: 'atb-school-date',
                          label: 'On what date did you (or the student) begin attending the school?',
                          type: 'date',
                          columnClassName: 'md-col-8',
                          validations: [
                            'required',
                          ],
                        },
                      ],
                    ]
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
                          columnClassName: 'md-col-4',
                          validations: [
                            'required',
                          ],
                        },
                        {
                          name: 'atb-attendance-to',
                          label: 'To',
                          type: 'date',
                          columnClassName: 'md-col-4',
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
                          columnClassName: 'md-col-4',
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
          ],
        },
        {
          type: 'information',
          name: 'atb-form',
          title: 'Ability to benefit / ATB Form',
          description: 'With your previous information we already complete The ATB form for you, you will receive copies at the end.',
          footer: 'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        personalStatement,
        evidenceUploader,
      ],
    },
    D: {
      title: 'When I borrowed to attend I had a condition (physical, mental, age, criminal record) that prevented me from meeting State requirements. ',
      description: 'Write a statement explaining more about the <a href="http://www.studentloanborrowerassistance.org/loan-cancellation/school-related/false-certification/disqualifying-status/" target="_blank" rel="noopener noreferrer">condition</a> that prevented you from using your degree. And attach any supporting documents.',
      steps: [
        personalInformation,
        {
          type: 'information',
          name: 'signature-form',
          title: 'Unauthorized Signature form',
          description: 'With your previous information we will complete the Unauthorized Signature form for you, you will receive copies at the end.',
          footer: 'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        evidenceUploader,
      ],
    },
    E: {
      title: 'I believe that an official at the school without my permission signed my name or used my personal identification data to obtain this loan illegally in my name. ',
      description: 'Provide as much information as you can about why you believe the loan was issued fraudulently.',
      steps: [
        personalInformation,
        personalStatement,
        evidenceUploader,
      ],
    },
  },
};
