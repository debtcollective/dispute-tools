/* globals Class, Attachment, Krypton */

const gm = require('gm');

const PostImage = Class('PostImage').inherits(Attachment)({
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
});

module.exports = PostImage;
