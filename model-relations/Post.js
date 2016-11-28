/* globals Post, Topic, User */

Post.relations = {
  comments: {
    type: 'HasMany',
    relatedModel: Post,
    ownerCol: 'id',
    relatedCol: 'parent_id',
    orderBy: ['created_at', 'DESC'],
  },

  topic: {
    type: 'HasOne',
    relatedModel: Topic,
    ownerCol: 'topic_id',
    relatedCol: 'id',
  },

  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },
};
