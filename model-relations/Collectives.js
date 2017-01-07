/* globals Collective, DisputeTool, User, Campaign, KBPost */

Collective.relations = {
  tools: {
    type: 'HasManyThrough',
    relatedModel: DisputeTool,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'CollectivesTools',
      ownerCol: 'collective_id',
      relatedCol: 'tool_id',
    },
  },

  users: {
    type: 'HasManyThrough',
    relatedModel: User,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'UsersCollectives',
      ownerCol: 'collective_id',
      relatedCol: 'user_id',
    },
    filters: {
      limit: 50,
    },
  },

  campaigns: {
    type: 'HasMany',
    relatedModel: Campaign,
    ownerCol: 'id',
    relatedCol: 'collective_id',
    orderBy: ['created_at', 'DESC'],
  },

  kbPosts: {
    type: 'HasMany',
    relatedModel: KBPost,
    ownerCol: 'id',
    relatedCol: 'collective_id',
    orderBy: ['created_at', 'DESC'],
  },
};
