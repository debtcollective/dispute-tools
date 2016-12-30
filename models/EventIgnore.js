/* globals Class, Krypton */

const EventIgnore = Class('EventIgnore').inherits(Krypton.Model)({
  tableName: 'EventIgnores',
  attributes: ['eventId', 'userId', 'id'],
});

module.exports = EventIgnore;
