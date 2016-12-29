/* globals CONFIG, Class, Krypton, Post */

const KBPost = Class('KBPost').inherits(Krypton.Model)({
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
    'createdAt',
    'updatedAt',
  ],

  prototype: {
    public: false,
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
    },
  },
});

module.exports = KBPost;
