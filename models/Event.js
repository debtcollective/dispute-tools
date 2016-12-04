/* globals CONFIG, Class, Krypton, Event */

Class('Event').inherits(Krypton.Model)({
  tableName: 'Events',
  validations: {
    campaignId: ['required'],
    userId: ['required'],
    name: ['required'],
    description: ['required'],
    date: ['required'],
    mapUrl: ['required'],
    locationName: ['required'],
  },

  attributes: [
    'id',
    'campaignId',
    'userId',
    'name',
    'description',
    'date',
    'mapUrl',
    'locationName',
    'createdAt',
    'updatedAt',
  ],

  prototype: {
    public: false,
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
    },
  },
});

module.exports = Events;
