/* globals Account, User, Collective */

Account.relations = {
  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },
  debtType: {
    type: 'HasOne',
    relatedModel: Collective,
    ownerCol: 'collective_id',
    relatedCol: 'id',
  },
};
