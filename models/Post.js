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
  },

  attributes: [
    'id',
    'parentId',
    'campaignId',
    'userId',
    'type',
    'data',
    'createdAt',
    'updatedAt',
  ],

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
    },
  },
});

module.exports = Post;
