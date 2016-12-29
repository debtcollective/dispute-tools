/* globals Class, Krypton */

const CollectiveBans = Class('CollectiveBans').inherits(Krypton.Model)({
  tableName: 'CollectiveBans',
  attributes: ['collectiveId', 'userId'],
});

module.exports = CollectiveBans;
