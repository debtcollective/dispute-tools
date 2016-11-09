/* globals Class, Krypton, Campaign */

const Campaign = Class('Campaign').inherits(Krypton.Model)({
  tableName: 'Campaigns',
  validations: {
    name: ['required'],
  },
  attributes: [
    'id',
    'collective_id',
    'title',
    'description',
    'createdAt',
    'updatedAt',
  ],
});

module.exports = Campaign;
