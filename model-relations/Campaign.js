/* globals Campaign, Collective, Post */

Campaign.relations = {
  collective: {
    type: 'HasOne',
    relatedModel: Collective,
    ownerCol: 'collective_id',
    relatedCol: 'id',
  },

  posts: {
    type: 'HasMany',
    relatedModel: Post,
    ownerCol: 'id',
    relatedCol: 'campaign_id',
    orderBy: ['created_at', 'DESC'],
    filters: {
      limit: 50,
    },
  },
};
