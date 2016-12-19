/* globals Class, Krypton */

const CollectiveBans = Class('CollectiveBans').inherits(Krypton.Model)({
  tableName: 'CollectiveBanss',
  attributes: ['collectiveId', 'userId'],
});

module.exports = ColectiveBans;
