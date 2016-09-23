/* eslint max-len: 0 */

const path = require('path');

const {
  personalInformation,
  personalStatement,
  evidenceUploader,
} = require(path.join(__dirname, 'constants.js'));

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
                [
                  {
                    name: 'atb-entrance-exam',
                    label: 'Before you (or the student) enrolled in the college, were you given an entrance exam?',
                    type: 'yesno',
                    default: 'no',
                    toggle: [
                      'atb-entrance-exam-date',
                      'atb-entrance-exam-name',
                      'atb-entrance-exam-score',
                    ],
                    validations: [
                      'required',
                    ],
                  },
                  {
                    name: 'atb-entrance-exam-date',
                    label: 'Give the date you took the test if you know it',
                    placeholder: 'YYYY-MM-DD or I don\'t know',
                    hidden: true,
                    validations: [
                      'required',
                      'maxLength:24',
                    ],
                  },
                  {
                    name: 'atb-entrance-exam-name',
                    label: 'Give the name of the test if you know it',
                    placeholder: 'Name or I don\'t know',
                    hidden: true,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                  {
                    name: 'atb-entrance-exam-score',
                    label: 'Give the score of the test if you know it',
                    placeholder: 'Score or I don\'t know',
                    hidden: true,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                  {
                    name: 'atb-entrance-exam-improper',
                    label: 'Did anything appear improper about the way the test was given?',
                    type: 'yesno',
                    default: 'no',
                    toggle: [
                      'atb-entrance-exam-improper-explain',
                      'atb-entrance-exam-improper-explain2',
                    ],
                    validations: [
                      'required',
                    ],
                  },
                  {
                    name: 'atb-entrance-exam-improper-explain',
                    label: 'Explain in detail what appeared improper',
                    hidden: true,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                  {
                    name: 'atb-entrance-exam-improper-explain2',
                    label: '',
                    hidden: true,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },

                ],
                [
                  {
                    title: 'Can anyone support the statement that the test was not given properly?',
                    subtitle: 'Please provide a name, address, and phone number for that person.',
                    yesno: true,
                    default: 'no',
                    type: 'group',
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
                      ],
                    ],
                  },
                ],

                [
                  {
                    title: 'Did you (or the student) complete a remedial program at the school?',
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
                                columnClassName: 'md-col-4',
                                validations: [
                                  'required',
                                ],
                              },
                              {
                                name: 'atb-remedial-program-to',
                                label: 'To',
                                type: 'date',
                                columnClassName: 'md-col-4',
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
                            'required',
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
