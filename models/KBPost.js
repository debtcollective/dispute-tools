/* globals CONFIG, Class, Krypton, Post */

const KBPost = Class('KBPost').inherits(Krypton.Model).includes(Krypton.Attachment)({
  attachmentStorage: new Krypton.AttachmentStorage.Local({
    maxFileSize: 5242880,
    acceptedMimeTypes: [/.+/],
  }),

  tableName: 'KBPosts',
  validations: {
    collectiveId: ['required'],
    name: ['required'],
  },

  attributes: [
    'id',
    'name',
    'collectiveId',
    'data',
    'filePath',
    'fileMeta',
    'createdAt',
    'updatedAt',
  ],

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
