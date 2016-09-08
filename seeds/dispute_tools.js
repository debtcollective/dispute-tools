exports.seed = (knex) => {
  const uuid = require('uuid');

  return knex('DisputeTools').del()
    .then(() => {
      const tools = [
        {
          name: 'Wage Garnishment Dispute',
          about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          completed: 0,
          data: {
            options: {
              A: {
                title: 'I do not owe the full amount I am being billed for because I repaid some or all of this debt.',
                description: 'Why do you believe you already paid this debt? Attach a detailed statement and upload any documents that prove you paid.',
                steps: [
                  {
                    type: 'form',
                    name: 'personal-information-form',
                    title: 'Personal Information',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    fieldSets: [
                      {
                        title: 'About You',
                        subtitle: 'Let\'s get stated',
                        fields: [
                          [
                            {
                              name: 'name',
                              label: 'Your Name',
                              columnClassName: '.two-thirds',
                              validations: [
                                'required',
                                'alpha',
                                'maxLength:128',
                              ],
                            },
                            {
                              name: 'ssn',
                              label: 'Social Security # (Last 4)',
                              columnClassName: '.one-thirds',
                              validations: [
                                'required',
                                'number',
                                'maxLength:4',
                              ],
                            },
                          ],
                          {
                            name: 'address1',
                            label: 'Your Address',
                            validations: [
                              'required',
                              'maxLength:128',
                            ],
                          },
                          {
                            name: 'address2',
                            label: 'Your Address 2',
                            validations: [
                              'maxLength:128',
                            ],
                          },
                          [
                            {
                              name: 'email',
                              label: 'Your email',
                              placeholder: 'you@example.com',
                              columnClassName: '.one-half',
                              validations: [
                                'required',
                                'email',
                                'maxLength:128',
                              ],
                            },
                            {
                              name: 'phone',
                              label: 'Your telephone',
                              placeholder: '(55) 555-5555-5555',
                              columnClassName: '.one-half',
                              validations: [
                                'required',
                                'alphaNumeric',
                                'maxLength:16',
                              ],
                            },
                          ],
                        ],
                      },
                      {
                        title: 'Your School',
                        fields: [
                          {
                            name: 'schoolName',
                            label: 'Name of the school where you incurred the debt',
                            validations: [
                              'required',
                              'maxLength:128',
                            ],
                          },
                          [
                            {
                              name: 'guarrantyAgency',
                              label: 'Name of Guarranty Agency',
                              subLabel: 'Required for FFEL loan holders',
                              columnClassName: '.one-half',
                              validations: [
                                'maxLength:128',
                              ],
                            },
                            {
                              name: 'guarrantyAgencyEmail',
                              label: 'Guarranty Agency mailing address',
                              subLabel: 'Required for FFEL loan holders',
                              columnClassName: '.one-half',
                              validations: [
                                'email',
                                'maxLength:128',
                              ],
                            },
                          ],
                        ]
                      },
                      {
                        title: 'Employment',
                        yesno: true,
                        fields: [
                          [
                            {
                              name: 'employer',
                              label: 'Current Employer',
                              columnClassName: '.two-thirds',
                              validations: [
                                'maxLength:128',
                              ],
                            },
                            {
                              name: 'employmentDate',
                              type: 'date',
                              label: 'Beggining Date',
                              columnClassName: '.one-thirds',
                              validations: [
                                'date',
                              ],
                            },
                          ],
                          {
                            name: 'employerAddress',
                            label: 'Employer Address',
                            validations: [
                              'maxLength:128',
                            ],
                          },
                          {
                            name: 'employerPhone',
                            label: 'Employer Phone',
                            columnClassName: '.one-third',
                            validations: [
                              'maxLength:23',
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'information',
                    name: 'atb-form',
                    title: 'Ability to benefit / ATB Form',
                    description: 'With your previous information we already complete The [ATB form](custom link) for you, you will receive copies at the end.',
                    footer: 'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
                  },
                  {
                    type: 'upload',
                    name: 'personal-statement-uploader',
                    multiple: false,
                    optional: false,
                    mimeTypes: [/image/, 'application/pdf'],
                    maxFileSize: 5242880,
                    title: 'Personal Statement',
                    description: 'In addition to providing evidence against the school, you can write a personal statement describing how your school lied to and defrauded you and upload it here.',
                    uploadButtonText: 'Upload files',
                  },
                ],
              },
              B: {
                title: 'I should not have to pay this debt because I was lied to or defrauded by my school.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
              C: {
                title: 'I did not have a high school diploma or GED when I enrolled at the school.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
              D: {
                title: 'When I borrowed to attend I had a condition (physical, mental, age, criminal record) that prevented me from meeting State requirements. ',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
              E: {
                title: 'I believe that an official at the school without my permission signed my name or used my personal identification data to obtain this loan illegally in my name. ',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
              F: {
                title: 'I never received the loan funds that are now attached to my name. The school owes me money.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
              G: {
                title: 'My school closed before I could complete my degree.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
            },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Tax Offset Dispute',
          about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          completed: 0,
          data: {
            options : {
              A: {
                title: 'My school closed before I could complete my degree.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },

              B: {
                title: 'My school closed before I could complete my degree.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                steps: [],
              },
            }
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'General Debt Dispute Letter',
          about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          completed: 0,
          data: {
            options: {
              'none': {

              },
            },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      return knex('DisputeTools').insert(tools.map((tool) => {
        return {
          id: uuid.v4(),
          name: tool.name,
          data: tool.data,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }));
    });
};
