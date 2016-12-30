/* globals EventAssistant, Event, User */

EventAssistant.relations = {
  campaign: {
    type: 'HasOne',
    relatedModel: Event,
    ownerCol: 'event_id',
    relatedCol: 'id',
  },

  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },

  assistans: {
    type: 'HasManyThrough',
    relatedModel: User,
    ownerCol: 'id',
    relatedCol: 'id',
    trough: {
      tableName: 'EventAssistants',
      ownerCol: 'event_id',
      relatedCol: 'user_id'
    }
  },
};
