/* eslint max-len: 0 */

module.exports = {
  disputeProcess: 1,
  nowWhat: `
    Thank for your disputing your debt! We can't tell you how long it will take for you to hear a response from the debt collector, since each collector handles disputes differently. We will prompt you to notify us when you get a reply. We are watching what happens with these disputes very closely so that we can find out which creditors are breaking the law and so we can find ways to work collectively to challenge them.
  `,
  options: {
    none: {
      title: 'Gather Materials',
      description: 'Before you begin, please have on hand a digital copy of letter you received in the mail from the collection agency or law firm.',
      steps: [
        {
          type: 'form',
          name: 'personal-information-form',
          title: 'Personal Information Form',
          description: 'Here we need some personal information.',
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
                    label: 'Your Mailing Address 2',
                    validations: [
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'firm-address',
                    label: 'Collection agency’s or law firm’s mailing address',
                    validations: [
                      'required',
                      'maxLength:256',
                    ],
                  },
                ],
                [
                  {
                    name: 'firm-name',
                    label: 'Name of the collection agency or law firm that last contacted you about your debt',
                    validations: [
                      'required',
                      'maxLength:256',
                    ],
                  },
                ],
                [
                  {
                    name: 'account-number',
                    label: 'Account Number',
                    validations: [
                      'required',
                      'maxLength:128',
                    ],
                  },
                ],
                [
                  {
                    name: 'last-correspondence-date',
                    label: 'Date of Last Correspondence',
                    type: 'date',
                    placeholder: 'mm-dd-yyyy',
                    validations: [
                      'required',
                      'maxLength:20',
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          type: 'upload',
          name: 'collections-letter-uploader',
          multiple: true,
          optional: false,
          mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxFileSize: 5242880,
          title: 'Collections Letter',
          description: 'Digital copy of letter you received in the mail from the collection agency or law firm',
          uploadButtonText: 'Upload files',
          footerNotes: 'JPEG, PNG, PDF format',
        },
      ],
    },
  },
};
