/* globals Class, Krypton */

const KBTopic = Class('KBTopic').inherits(Krypton.Model)({
  tableName: 'KBTopics',

  validations: {
    title: ['required'],
  },

  attributes: ['id', 'title', 'createdAt', 'updatedAt'],

});

module.exports = KBTopic;
