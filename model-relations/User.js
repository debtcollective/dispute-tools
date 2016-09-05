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
  },
};
