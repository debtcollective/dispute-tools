/* eslint-disable max-len */
exports.seed = (knex) => {
  const uuid = require('uuid');

  return knex('DisputeTools').del()
    .then(() => {
      const tools = [
        {
          name: 'Wage Garnishment Dispute',
          about: `### Wage Garnishment for Federal Student Loans Dispute

If your wages are being garnished or if you received a letter threatening wage garnishment, you have a lot in common with thousands of other people whose wages are seized every year. This is wrong, since no one should have to go into debt for education!

You can use this form to submit a dispute to the Department of Education (for Direct Loans) and to the guaranty agency (for FFEL loans). We streamlined this form for our members because the Department's form is unnecessarily complicated.

PLEASE NOTE: **Before you begin the wage garnishment dispute process, you should find out who owns your student loans.**

If you have Direct loans, we will send your dispute to the Department of Education. If you have FFEL loans, you will need to provide the name and address of the originator of your loan. If you don't know the name of the guarantor, you can call the Department of the Treasury and ask them for the name and address of your guarantor.<br/>
The number is: 1-800-304-3107.`,
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
                        ],
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
          about: `### Tax Offset for Federal Student Loans

If your taxes are being seized ("offset") or if you have been threatened with offset, you have a lot in common with thousands of other people whose taxes are offset each year. This is wrong, since no one should have to go into debt for education!

You can use this form to submit a dispute to the Department of Education. The Department's form is unnecessarily complicated. We have streamlined the process for our members. You can make sure your offset is placed on hold if you file this dispute by 65 days after the date you received the offset notice. You can also stop an offset that has already begun if you receive a favorable decision from the Department.

**What if I suspect that my taxes will be offset but I haven't received a notice?**

The Department of Education usually sends offset notices once per year in the summer. If you want to know whether your taxes will be offset as a result of a federal student loan, you can call the Bureau of the Fiscal Service at 1-800-304-3107. Making this call does not make it more likely that your taxes will be offset.`,
          completed: 0,
          data: {
            options: {
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
            },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'General Debt Dispute Letter',
          about: `### General Debt Dispute Letter

#### for any defaulted personal debt

This tool is for anyone who is in default on a debt. If you have been contacted by a collector who bought your loan from the original lender, you can fill out this form. Most of the time, collectors can't prove they own your debt, so by disputing the loan you may be able to stop collections. Before you begin to use this tool, you should make sure you have the name and address of the collections agency that is attempting to collect from you.

**If you don't have the name and address of the collection agency, you will not be able to file this dispute.**`,
          completed: 0,
          data: {
            options: {
              none: {

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
          about: tool.about,
          completed: tool.completed,
          data: tool.data,
          created_at: tool.created_at,
          updated_at: tool.updated_at,
        };
      }));
    });
};
