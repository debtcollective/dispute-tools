/* globals Class, Krypton */

const EventAssistant = Class('EventAssistant').inherits(Krypton.Model)({
  tableName: 'EventAssistants',
  attributes: ['eventId', 'userId', 'ignore', 'id'],
});

module.exports = EventAssistant;
