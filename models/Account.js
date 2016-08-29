/* global Krypton, Class, CONFIG, AttachmentsProcessor, AWS, S3Uploader */

const US_STATES = require('datasets-us-states-names');

const Account = Class('Account').inherits(Krypton.Model).includes(AttachmentsProcessor)({
  tableName: 'Accounts',
  states: US_STATES,
  validations: {
    userId: ['required'],
    collectiveId: ['required'],
    fullname: ['required'],
    state: [
      'required',
      {
        rule(val) {
          if (Account.states.indexOf(val) === -1) {
            throw new Error('The Account\'s state is invalid.');
          }
        },
        message: 'The Account\'s state is invalid.',
      },
    ],
    zip: [
      'required',
      {
        rule(val) {
          if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val) === false) {
            throw new Error('The Account\'s zip code is invalid.');
          }
        },
        message: 'The Account\'s zip code is invalid.',
      },
    ],
  },
  attributes: [
    'id',
    'userId',
    'collectiveId',
    'fullname',
    'bio',
    'state',
    'zip',
    'socialLinks',
    'imagePath',
    'imageMeta',
    'createdAt',
    'updatedAt',
  ],
});

module.exports = Account;
