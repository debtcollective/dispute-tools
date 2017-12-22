/* globals Account, User, Collective, Dispute, Event, Post, Campaign */

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
    scope: ['deactivated', false],
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

  campaigns: {
    type: 'HasMany',
    relatedModel: Campaign,
    ownerCol: 'id',
    relatedCol: 'id',
    through: {
      tableName: 'UsersCampaigns',
      ownerCol: 'user_id',
      relatedCol: 'campaign_id',
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

  eventsOwner: {
    type: 'HasMany',
    relatedModel: Event,
    ownerCol: 'id',
    relatedCol: 'user_id',
  },

  posts: {
    type: 'HasMany',
    relatedModel: Post,
    ownerCol: 'id',
    relatedCol: 'user_id',
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
