/* globals Class, Krypton, Attachment */
const gm = require('gm').subClass({ imageMagick: process.env.GM === 'true' || false });
const { assignDefaultConfig } = require('../lib/AWS');
const PrivateAttachmentStorage = require('./PrivateAttachmentStorage');

const DisputeAttachment = Class({}, 'DisputeAttachment').inherits(Attachment)({
  attachmentStorage: new PrivateAttachmentStorage(assignDefaultConfig({
    acceptedMimeTypes: [/image/, /application/],
    maxFileSize: 20971520, // 20MB
  })),
  init(config) {
    Krypton.Model.prototype.init.call(this, config);

    this.fileMeta = this.fileMeta || {};

    this.hasAttachment({
      name: 'file',
      versions: {
        thumb(readStream) {
          return gm(readStream)
            .resize(40, 40)
            .stream();
        },
      },
    });
  },
});

module.exports = DisputeAttachment;
