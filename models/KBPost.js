/* globals CONFIG, Class, Krypton, Post */

const KBPost = Class('KBPost').inherits(Krypton.Model).includes(Krypton.Attachment)({
  attachmentStorage: new Krypton.AttachmentStorage.Local({
    maxFileSize: 5242880,
    acceptedMimeTypes: [/.+/],
  }),

  tableName: 'KBPosts',
  validations: {
    collectiveId: ['required'],
    topicId: ['required'],
    name: ['required'],
  },

  attributes: [
    'id',
    'name',
    'topicId',
    'collectiveId',
    'data',
    'filePath',
    'fileMeta',
    'createdAt',
    'updatedAt',
  ],

  search(qs) {
    const query = this.knex()
      .select('name', 'id').from('KBPosts');

    if (qs) {
      query.where('name', 'ilike', `%${qs}%`);
    }

    return query
      .then((results) => {
        return results.map((item) => {
          return item.id;
        });
      });
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
