/* globals Account, User, Collective */

User.relations = {
  account: {
    type: 'HasOne',
    relatedModel: Account,
    ownerCol: 'id',
    relatedCol: 'user_id',
  },
};
