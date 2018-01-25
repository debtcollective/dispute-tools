/* globals Class, Krypton */

const Topic = Class('Topic').inherits(Krypton.Model)({
  tableName: 'Topics',

  validations: {
    title: ['required'],
  },

  attributes: ['id', 'title', 'createdAt', 'updatedAt'],
});

module.exports = Topic;
