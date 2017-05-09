/* eslint max-len: 0 */

module.exports = {
  disputeProcess: 1,
  nowWhat: `
    Thank you for disputing your credit report. Your dispute will be sent to the agencies you specified. The dispute process can take up to 30 days. You should hear a response directly from each of the agencies.
    <br><br>
    We will prompt you to report the results of your dispute so we can make sure Debt Collective member's rights are respected and that errors are promptly removed.
  `,
  options: {
    none: {
      title: 'Gather Materials',
      description: 'Once you have determined that there are errors on your report, you can use this tool to ask for a correction. This tool will help you write a dispute letter to the three main credit reporting agencies. The Debt Collective will submit the letters your behalf if you request it. Consumer reporting agencies have 5 business days after completing an investigation to notify you of the results. Generally, they must investigate the dispute within 30 days of receiving it.',
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
                    columnClassName: 'md-col-8',
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'dob',
                    label: 'Your date of birth?',
                    type: 'date',
                    validations: [
                      'required',
                    ],
                  },
                ],
                [
                  {
                    name: 'ssn',
                    label: 'Your SSN',
                    attributes: { placeholder: 'AAA-GG-SSSS', maxlength: 11 },
                    columnClassName: 'md-col-6',
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
                    name: 'address',
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
                    columnClassName: 'md-col-12',
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
                ],
                [
                  {
                    title: 'Please select which credit reporting agency or agencies you would like your dispute to go to',
                    type: 'group',
                    fields: [
                      [
                        {
                          name: 'agencies',
                          label: 'Experian',
                          type: 'checkbox',
                          validations: [

                          ],
                          attributes: {
                            value: 'Experian'
                          },
                        }
                      ],
                      [
                        {
                          name: 'agencies',
                          label: 'Equifax',
                          type: 'checkbox',
                          validations: [

                          ],
                          attributes: {
                            value: 'Equifax'
                          },
                        }
                      ],
                      [
                        {
                          name: 'agencies',
                          label: 'TransUnion',
                          type: 'checkbox',
                          validations: [

                          ],
                          attributes: {
                            value: 'TransUnion'
                          },
                        }
                      ],
                    ],
                  }
                ],
              ],
            },
          ],
        },
        {
          type: 'information',
          name: 'credit-dispute-letter',
          title: 'Credit Report Dispute Letter',
          description: 'With your previous information we’ll fill this letter for you, you will receive copies at the end.',
          footer: 'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        {
          type: 'upload',
          name: 'picture-id-uploader',
          multiple: false,
          optional: false,
          mimeTypes: ['image/jpeg', 'image/png'],
          maxFileSize: 5242880,
          title: 'Picture ID',
          description: 'Please attach a photo of your picture ID. ',
          uploadButtonText: 'Upload file',
          footerNotes: 'JPEG, PNG format',
        },
        {
          type: 'upload',
          name: 'credit-errors-uploader',
          multiple: true,
          optional: true,
          mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxFileSize: 5242880,
          title: 'Credit report errors',
          description: 'Please attach a document highlighting credit report errors.',
          uploadButtonText: 'Upload files',
          footerNotes: 'JPEG, PNG, PDF format',
        },
      ],
    },
  },
};
