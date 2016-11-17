/* globals Class, Krypton, Campaign */

const Campaign = Class('Campaign').inherits(Krypton.Model)({
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
    'createdAt',
    'updatedAt',
  ],

  prototype: {
    userCount: 0,
    active: false,
    published: false,
  },
});

module.exports = Campaign;
