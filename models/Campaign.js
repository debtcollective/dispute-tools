/* globals Class, Krypton, Campaign */

const gm = require('gm').subClass({
  imageMagick: process.env.GM === 'true' || false,
});
const { assignDefaultConfig, buildFullPaths } = require('../lib/AWS');

const Campaign = Class('Campaign')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
  tableName: 'Campaigns',
  validations: {
    title: ['required'],
  },
  attributes: [
    'id',
    'collectiveId',
    'title',
    'introText',
    'description',
    'active',
    'userCount',
    'published',
    'coverMeta',
    'coverPath',
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
    userCount: 0,
    active: false,
    published: false,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.coverMeta = this.coverMeta || {};

      this.hasAttachment({
        name: 'cover',
        versions: {
          small(readStream) {
            return gm(readStream)
              .resize(100, 100)
              .gravity('Center')
              .crop(100, 100, 0, 0)
              .setFormat('jpg')
              .stream();
          },
          smallGrayscale(readStream) {
            return gm(readStream)
              .resize(100, 100)
              .type('Grayscale')
              .gravity('Center')
              .crop(100, 100, 0, 0)
              .setFormat('jpg')
              .stream();
          },
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

module.exports = Campaign;
