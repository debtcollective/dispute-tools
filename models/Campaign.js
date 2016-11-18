/* globals Class, Krypton, Campaign */

const gm = require('gm');

const Campaign = Class('Campaign').inherits(Krypton.Model).includes(Krypton.Attachment)({
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

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.fileMeta = this.fileMeta || {};

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

      return this;
    },
  },
});

module.exports = Campaign;
