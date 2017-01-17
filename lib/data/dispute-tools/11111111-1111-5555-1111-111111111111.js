/* eslint max-len: 0 */
const path = require('path');

const {
  US_STATES,
  LOAN_SERVICERS,
  CORINTHIAN_SCHOOLS,
  evidenceUploader,
} = require(path.join(__dirname, 'constants.js'));

module.exports = {
  disputeProcess: 1,
  nowWhat: `
  Thank you for disputing your Federal student loans. We don’t know how long the Department of Education will take to review your claim.
  <br><br>
  We are watching the situation very closely to make sure that everyone gets a fair hearing and that the Department is following the law. We have ongoing campaigns to pressure the Department to cancel all defrauded borrowers’ debt.
  <br><br>
  To learn how to participate, log in to the platform and join the conversation. You are not a loan.
  `,
  options: {
    none: {
      title: 'Gather Materials',
      description: '',
      steps: [
        {
          type: 'form',
          name: 'personal-information-form',
          title: 'Personal Information',
          description: 'Here we need some personal, school and employment information.',
          fieldSets: [
            {
              title: 'Personal Information',
              fields: [
                [
                  {
                    name: 'name',
                    label: 'Your Full Name',
                    validations: [
                      'required',
                      'maxLength:128',
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
                    name: 'city',
                    label: 'Your City',
                    columnClassName: 'md-col-4',
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                  {
                    name: 'state',
                    label: 'Your State',
                    type: 'dropdown',
                    options: US_STATES,
                    columnClassName: 'md-col-4',
                    validations: [
                      'required',
                    ],
                  },
                  {
                    name: 'zip',
                    label: 'Your Zip',
                    columnClassName: 'md-col-4',
                    validations: [
                      'required',
                      'alphaDash',
                    ],
                  },
                ],
                [
                  {
                    name: 'email',
                    label: 'Your email',
                    attributes: { placeholder: 'you@example.com' },
                    columnClassName: 'md-col-4',
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
                    columnClassName: 'md-col-4',
                    validations: [
                      'required',
                      'maxLength:20',
                    ],
                  },
                  {
                    name: 'ssn',
                    label: 'Social Security Number',
                    attributes: { placeholder: 'AAA-GG-SSSS', maxlength: 11 },
                    columnClassName: 'md-col-4',
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
            {
              title: 'Your Employment',
              type: 'group',
              yesno: true,
              name: 'employment-radio-option',
              label: 'Are you currently employed?',
              fields: [
                [
                  {
                    name: 'field-of-study',
                    label: 'Is your job in your field of study?',
                    type: 'yesno',
                    default: 'no',
                  },
                ],
              ],
            },
            {
              title: 'Your loan',
              type: 'group',
              fields: [
                [
                  {
                    name: 'loan-servicer',
                    label: 'Who is your loan servicer?',
                    type: 'dropdown',
                    options: LOAN_SERVICERS,
                    validations: [
                      'required',
                    ],
                  },
                ],
                [
                  {
                    name: 'servicer-choosen',
                    label: 'Did you choose the lender of your federal student loans?',
                    subLabel: 'Most students did not choose their own federal student loan lender. You should only choose "yes" if you took out some or all of your loans before 2010, and you had the option to take out federal student loans from different lenders.',
                    type: 'yesno',
                    default: 'no',
                  },
                ],
              ],
            },
            {
              title: 'Your school',
              type: 'group',
              fields: [
                [
                  {
                    name: 'is-corinthian',
                    label: 'Did you attended a Corinthian campus? (Everest, WyoTech, Heald)',
                    type: 'yesno',
                    default: 'no',
                    toggle: [
                      'school-name-list',
                      'school-name',
                      'school-address',
                      'school-city',
                      'school-state',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-name-list',
                    label: 'Which campus did you attend',
                    hidden: true,
                    type: 'dropdown',
                    options: CORINTHIAN_SCHOOLS,
                    validations: [
                      'required',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-name',
                    label: 'School Name',
                    hidden: false,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-address',
                    label: 'School Address',
                    subLabel: 'If you can’t remember your campus’s address and don’t have any records stating it, entering the name of your school into a search engine may turn up its address. If you can’t find the address, you can enter just your school campus’s state.',
                    hidden: false,
                    validations: [
                      'required',
                      'maxLength:256',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-city',
                    label: 'School City',
                    hidden: false,
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-state',
                    label: 'School State',
                    hidden: false,
                    type: 'dropdown',
                    options: US_STATES,
                    validations: [
                      'required',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-attendance_from',
                    label: 'When did you attend school?: From',
                    attributes: { placeholder: 'month, year' },
                    columnClassName: 'md-col-6',
                    validations: [
                      'required',
                      'maxLength:20',
                    ],
                  },
                  {
                    name: 'school-attendance_to',
                    label: 'To',
                    attributes: { placeholder: 'month, year' },
                    columnClassName: 'md-col-6',
                    validations: [
                      'required',
                      'maxLength:20',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-program-name',
                    label: 'What was the name of your program?',
                    attributes: { placeholder: 'e.g. Medical Assisting, Business Management' },
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-degree',
                    label: 'What type of degree were you working on? (Select your highest degree.)',
                    type: 'dropdown',
                    options: [
                      'Associates',
                      'Certificate',
                      'Bachelors',
                      'Masters',
                    ],
                    validations: [
                      'required',
                    ],
                  },
                ],
                [
                  {
                    name: 'school-program-completed',
                    label: 'Did you complete the program?',
                    type: 'yesno',
                    default: 'no',
                  },
                ],
              ],
            },

            {
              title: 'Your experience',
              subtitle: 'Now we’ll prompt you to describe different aspects of your experience with your school.',
              type: 'group',
              fields: [
                [
                  {
                    title: 'Job placement',
                    subtitle: 'Did your school lie to you or mislead you about your job prospects? This could include:',
                    type: 'group',
                    text: `
                      <ul>
                        <li>Citing false or misleading statistics about job placement rates</li>
                        <li>Promising inflated salaries</li>
                        <li>Promising but failing to provide support in finding and landing a job.</li>
                      </ul>
                    `,
                    yesno: true,
                    name: 'job-placement-radio-option',
                    fields: [
                      [
                        {
                          name: 'job-placement-detail',
                          label: 'Please explain in detail.',
                          type: 'text',
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
                    title: 'Accreditation',
                    subtitle: 'Did your school mislead you about the quality of the education you would receive? This could include:',
                    type: 'group',
                    text: `
                      <ul>
                        <li>Falsely claiming that the school had the proper accreditation to allow its graduates to take a particular licensing exam</li>
                        <li>Falsely claiming that it offered the classes necessary to achieve employment and/or certification in a particular field</li>
                        <li>Citing misleading statistics about the pass rate of students on required licensing or certification exams.</li>
                      </ul>
                    `,
                    yesno: true,
                    name: 'accreditation-radio-option',
                    fields: [
                      [
                        {
                          name: 'accreditation-detail',
                          label: 'Please explain in detail.',
                          type: 'text',
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
                    title: 'Eligibility',
                    subtitle: 'Did your school mislead you about whether you were eligible to benefit from the program? This could include:',
                    type: 'group',
                    text: `
                    <ul>
                      <li>Enrolling you even though you did not have a high school diploma or GED</li>
                      <li>Claiming that a felony record or disability would not stand in the way of employment in a particular field.</li>
                    </ul>
                    `,
                    yesno: true,
                    name: 'eligibility-radio-option',
                    fields: [
                      [
                        {
                          name: 'eligibility-detail',
                          label: 'What did your school do? If any of the listed behaviours apply, please state which.',
                          type: 'text',
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
                    title: 'Cost/payment',
                    subtitle: 'Did your school mislead you about how you would pay for the program? This could include:',
                    type: 'group',
                    text: `
                      <ul>
                        <li>Understating the total cost of the program</li>
                        <li>Signing loan paperwork without your permission</li>
                        <li>Understating the amount of loans necessary</li>
                        <li>Treating grants and loans as if they were the same thing</li>
                        <li>Treating federal and private loans as if they were the same thing</li>
                        <li>Refusing to disclose loan terms or allow review of loan documents</li>
                      </ul>
                    `,
                    yesno: true,
                    name: 'cost-payment-radio-option',
                    fields: [
                      [
                        {
                          name: 'cost-payment-detail',
                          label: 'What did your school do? If any of the listed behaviours apply, please state which.',
                          type: 'text',
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
                    title: 'Illegal activity',
                    subtitle: 'Did your school mislead you about the extent of the illegal activities there, and the effect those activities would have on your school’s reputation and continued existence? This could include:',
                    type: 'group',
                    text: `
                    <ul>
                      <li>The school shutting down in light of lawsuits or financial mismanagement</li>
                      <li>Finding that having your school on a resume repels employers who have heard about its illegal practices</li>
                    </ul>
                    `,
                    yesno: true,
                    name: 'illegal-activity-radio-option',
                    fields: [
                      [
                        {
                          name: 'illegal-activity-detail',
                          label: 'What did your school do? If any of the listed behaviours apply, please state which.',
                          type: 'text',
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
                    title: 'Other',
                    subtitle: 'Did your school mislead you in other ways that you didn’t already describe?',
                    type: 'group',
                    yesno: true,
                    name: 'other-radio-option',
                    fields: [
                      [
                        {
                          name: 'other-detail',
                          label: 'What did your school do? ',
                          type: 'text',
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
                    title: 'Measure of injury',
                    subtitle: 'Now we’ll ask you to explain how the conduct you’ve already described here by your school caused you harm and put you in debt. Because of this conduct, I’ve suffered the following harm:',
                    type: 'group',
                    fields: [
                      [
                        {
                          name: 'student-loan-checkbox',
                          label: 'Student loan debt',
                          type: 'checkbox',
                        },
                      ],
                      [
                        {
                          name: 'credits-wont-transfer-checkbox',
                          label: 'I couldn’t enroll in another school because my credits wouldn’t transfer.',
                          type: 'checkbox',
                        },
                      ],
                      [
                        {
                          name: 'more-student-loan-checkbox',
                          label: 'I couldn’t enroll in another school because I couldn’t take out more student loan debt.',
                          type: 'checkbox',
                        },
                      ],
                      [
                        {
                          name: 'name-on-resume-checkbox',
                          label: 'I had a hard time finding a job in my field because my school was on my resume',
                          type: 'checkbox',
                        },
                      ],
                      [
                        {
                          name: 'stress-checkbox',
                          label: 'Other injury, including stress or emotional pain',
                          type: 'checkbox',
                        },
                      ],
                    ],
                  },
                ],
              ],
            },
          ],
        },
        evidenceUploader,
      ],
    },
  },
};
