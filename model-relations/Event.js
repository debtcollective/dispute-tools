/* globals Event, Campaign, User */

Event.relations = {
  campaign: {
    type: 'HasOne',
    relatedModel: Campaign,
    ownerCol: 'campaign_id',
    relatedCol: 'id',
  },

  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },
};
