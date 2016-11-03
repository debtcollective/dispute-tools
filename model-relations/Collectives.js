/* globals Collective, DisputeTool, */

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
  }
};
