/* globals Class, Krypton, Collective */

const gm = require('gm').subClass({
  imageMagick: process.env.GM === 'true' || false,
});
const { assignDefaultConfig, buildFullPaths } = require('../lib/AWS');

const Collective = Class('Collective')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
  tableName: 'Collectives',
  validations: {
    name: ['required'],
  },
  attributes: [
    'id',
    'name',
    'description',
    'manifest',
    'goalTitle',
    'goal',
    'userCount',
    'coverPath',
    'coverMeta',
    'createdAt',
    'updatedAt',
  ],
  attachmentStorage: new Krypton.AttachmentStorage.S3(
    assignDefaultConfig({
      maxFileSize: 5242880,
      acceptedMimeTypes: [/image/],
    }),
  ),

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.coverMeta = this.coverMeta || {};

      this.hasAttachment({
        name: 'cover',
        versions: {
          grayscale(readStream) {
            return gm(readStream)
              .resize(500, null, '>')
              .type('Grayscale')
              .setFormat('jpg')
              .stream();
          },
        },
      });

      this.cover.urls = buildFullPaths(this.cover);

      return this;
    },
  },
});

module.exports = Collective;
