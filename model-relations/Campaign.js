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
    relatedCol: 'collective_id',
    orderBy: ['created_at', 'DESC'],
  },
};
