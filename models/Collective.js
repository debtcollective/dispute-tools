/* globals Class, Krypton, Collective */

const gm = require('gm');

const Collective = Class('Collective').inherits(Krypton.Model)({
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
    'cover_path',
    'cover_meta',
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

module.exports = Collective;
