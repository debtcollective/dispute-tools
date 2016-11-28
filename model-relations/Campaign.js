/* globals Campaign, Collective, Post, User */

Campaign.relations = {
  collective: {
    type: 'HasOne',
    relatedModel: Collective,
    ownerCol: 'collective_id',
    relatedCol: 'id',
  },

  users: {
    type: 'HasManyThrough',
    relatedModel: User,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'UsersCampaigns',
      ownerCol: 'campaign_id',
      relatedCol: 'user_id',
    },
    filters: {
      limit: 50,
    },
  },
};
