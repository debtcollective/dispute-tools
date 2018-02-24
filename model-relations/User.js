/* globals User, Dispute */

User.relations = {
  disputes: {
    type: 'HasMany',
    relatedModel: Dispute,
    ownerCol: 'id',
    relatedCol: 'user_id',
    orderBy: ['created_at', 'DESC'],
    scope: ['deactivated', false],
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
