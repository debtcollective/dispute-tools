/* globals Account, User, Collective, Dispute */

User.relations = {
  account: {
    type: 'HasOne',
    relatedModel: Account,
    ownerCol: 'id',
    relatedCol: 'user_id',
  },
  disputes: {
    type: 'HasMany',
    relatedModel: Dispute,
    ownerCol: 'id',
    relatedCol: 'user_id',
    orderBy: ['created_at', 'DESC'],
    scope: ['deleted', false],
  },


  debtTypes: {
    type: 'HasManyThrough',
    relatedModel: Collective,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'UsersCollectives',
      ownerCol: 'user_id',
      relatedCol: 'collective_id',
    },
  },
};
