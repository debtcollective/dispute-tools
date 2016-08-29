/* global Krypton, Class, CONFIG, AttachmentsProcessor, AWS, S3Uploader */

const US_STATES = require('datasets-us-states-names');
const path = require('path');
require('s3-uploader');

const imageProcessor = require(path.join(process.cwd(), 'lib', 'image-processor'));
const LocalFS = require(path.join(process.cwd(), 'lib', 'node-attachment-processor-local-fs'));

let uploader;

// if (['production', 'staging'].indexOf(CONFIG.environment) !== -1) {
  uploader = new S3Uploader(AWS, {
    bucket: `thedebtcollective`,
    pathPrefix: 'accounts',
  });
// } else {
//   uploader = new LocalFS({
//     pathPrefix: 'accounts',
//   });
// }

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
  PROCESSOR_VARIATIONS: [
    {
      matchMimeType: /image\/(jpe?g|png)/,
      processor: imageProcessor.process,
      name: 'tiny',
      meta: {
        maxWidth: 40,
        maxHeight: 40,
      },
    },
    {
      matchMimeType: /image\/(jpe?g|png)/,
      processor: imageProcessor.process,
      name: 'small',
      meta: {
        maxWidth: 50,
        maxHeight: 50,
      },
    },
    {
      matchMimeType: /image\/(jpe?g|png)/,
      processor: imageProcessor.process,
      name: 'medium',
      meta: {
        maxWidth: 170,
        maxHeight: 170,
      },
    },
  ],
  uploaderInstance: uploader,
  prototype: {

  },
});

module.exports = Account;
