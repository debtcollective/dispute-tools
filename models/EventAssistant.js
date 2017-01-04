/* globals Class, Krypton */

const EventAssistant = Class('EventAssistant').inherits(Krypton.Model)({
  tableName: 'EventAssistants',
  attributes: ['eventId', 'userId', 'id'],
});

module.exports = EventAssistant;
