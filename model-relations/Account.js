/* globals Account, User */

Account.relations = {
  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },
};
