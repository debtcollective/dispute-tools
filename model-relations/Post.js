/* globals Post, Topic */

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
};
