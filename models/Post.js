/* globals CONFIG, Class, Krypton, Post */

Class('Post').inherits(Krypton.Model)({
  tableName: 'Posts',
  types: [
    'Text',
    'Image',
    'Poll',
  ],
  validations: {
    type: [
      'required',
      {
        rule(val) {
          if (!Post.types.includes(val)) {
            throw new Error('Invalid post type');
          }
        },
        message: 'Invalid post type',
      },
    ],
    campaignId: ['required'],
  },

  attributes: [
    'id',
    'parentId',
    'campaignId',
    'userId',
    'topicId',
    'type',
    'data',
    'public',
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

    unsetUser() {
      this.userId = null;
      return this.save();
    },

  },
});

module.exports = Post;
