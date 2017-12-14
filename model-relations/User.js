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

  collectiveAdmins: {
    type: 'HasManyThrough',
    relatedModel: Collective,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'CollectiveAdmins',
      ownerCol: 'user_id',
      relatedCol: 'collective_id',
    },
  },

  disputeAdmin: {
    type: 'HasManyThrough',
    relatedModel: Dispute,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'AdminsDisputes',
      ownerCol: 'admin_id',
      relatedCol: 'dispute_id',
    },
  },
};
