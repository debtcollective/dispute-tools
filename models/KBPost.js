/* globals CONFIG, Class, Krypton, Post */

const { assignDefaultConfig } = require('../lib/AWS');

const KBPost = Class('KBPost')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
  attachmentStorage: new Krypton.AttachmentStorage.S3(
    assignDefaultConfig({
      maxFileSize: 5242880,
      acceptedMimeTypes: [/.+/],
    }),
  ),

  tableName: 'KBPosts',
  validations: {
    campaignId: ['required'],
    topicId: ['required'],
    name: ['required'],
  },

  attributes: [
    'id',
    'name',
    'topicId',
    'campaignId',
    'data',
    'filePath',
    'fileMeta',
    'createdAt',
    'updatedAt',
  ],

  search(qs) {
    const query = this.knex()
      .select('name', 'id')
      .from('KBPosts');

    if (qs) {
      query.where('name', 'ilike', `%${qs}%`);
    }

    return query.then(results => results.map(item => item.id));
  },

  prototype: {
    public: false,
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      this.hasAttachment({
        name: 'file',
      });

      return this;
    },
  },
});

module.exports = KBPost;
