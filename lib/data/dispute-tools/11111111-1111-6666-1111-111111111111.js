/* eslint max-len: 0 */

const { US_STATES } = require('..');
const Field = require('./validations');

const { date, zip, text, textLong } = Field.FieldValidation;

module.exports = {
  disputeProcess: 1,
  nowWhat: `
    Thank for your disputing your debt! We can't tell you how long it will take for you to hear a response from the debt collector, since each collector handles disputes differently. We will prompt you to notify us when you get a reply. We are watching what happens with these disputes very closely so that we can find out which creditors are breaking the law and so we can find ways to work collectively to challenge them.
  `,
  options: {
    none: {
      title: 'Gather Materials',
      description:
        'Before you begin, please have on hand a digital copy of letter you received in the mail from the collection agency or law firm.',
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
                  new Field({
                    name: 'name',
                    label: 'Your Full Name',
                    validations: text,
                  }),
                ],
                [
                  new Field({
                    name: 'address',
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
                    name: 'firm-name',
                    label: 'Name of the collection agency, firm, or creditor who last contacted you',
                    validations: textLong,
                  }),
                ],
                [
                  new Field({
                    name: 'firm-address',
                    label: 'Collection agency’s or law firm’s mailing address',
                    validations: text,
                  }),
                ],
                [
                  new Field({
                    name: 'firm-city',
                    label: 'Collection agency’s or law firm’s City',
                    columnClassName: 'md-col-4',
                    validations: text,
                  }),
                  new Field({
                    name: 'firm-state',
                    label: 'Collection agency’s or law firm’s State',
                    columnClassName: 'md-col-4',
                    type: 'dropdown',
                    options: US_STATES,
                  }),
                  new Field({
                    name: 'firm-zip-code',
                    label: 'Collection agency’s or law firm’s Zip Code',
                    columnClassName: 'md-col-4',
                    validations: zip,
                  }),
                ],
                [
                  new Field({
                    name: 'account-number',
                    label: 'Account Number',
                    validations: text,
                  }),
                ],
                [
                  new Field({
                    name: 'last-correspondence-date',
                    label: 'Date of Last Correspondence',
                    type: 'date',
                    validations: date,
                  }),
                ],
                [
                  new Field({
                    name: 'is-debt-in-default',
                    label: 'Is your debt in default?',
                    type: 'yesno',
                  }),
                ],
              ],
            },
          ],
        },
        {
          type: 'upload',
          name: 'collections-letter-uploader',
          multiple: true,
          optional: true,
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
