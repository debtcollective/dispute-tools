/* globals Class, Attachment, Krypton */

const { assignDefaultConfig } = require('../lib/AWS');
const gm = require('gm').subClass({ imageMagick: process.env.GM === 'true' || false });

const PostImage = Class('PostImage').inherits(Attachment)({
  attachmentStorage: new Krypton.AttachmentStorage.S3(assignDefaultConfig({
    maxFileSize: 5242880,
    acceptedMimeTypes: [/image/],
  })),

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.type = 'Post';

      this.fileMeta = this.fileMeta || {};

      this.hasAttachment({
        name: 'file',
        versions: {
          thumb(readStream) {
            return gm(readStream)
              .resize(500, null, '>')
              .stream();
          },
        },
      });
    },
  },
});

module.exports = PostImage;
