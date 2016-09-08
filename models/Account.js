/* global Krypton, Class, CONFIG, AttachmentsProcessor, AWS, S3Uploader */
const gm = require('gm').subClass({ imageMagick: true });

const US_STATES = require('datasets-us-states-names');

const Account = Class('Account').inherits(Krypton.Model).includes(Krypton.Attachment)({
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
    phone: ['alphaDash'],
  },
  attributes: [
    'id',
    'userId',
    'collectiveId',
    'fullname',
    'bio',
    'state',
    'zip',
    'phone',
    'socialLinks',
    'imagePath',
    'imageMeta',
    'createdAt',
    'updatedAt',
  ],
  attachmentStorage: new Krypton.AttachmentStorage.Local({
    maxFileSize: 5242880,
    acceptedMimeTypes: [/image/],
  }),

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.hasAttachment({
        name: 'image',
        versions: {
          small(readStream) {
            return gm(readStream)
              .resize(64, 64)
              .setFormat('jpg')
              .stream();
          },
          medium(readStream) {
            return gm(readStream)
              .resize(256, 256)
              .setFormat('jpg')
              .stream();
          },
        },
      });

      return this;
    },
  },
});

module.exports = Account;
