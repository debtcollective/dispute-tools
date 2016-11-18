/* globals Post */

Post.relations = {
  type: 'HasMany',
  relatedModel: Post,
  ownerCol: 'id',
  relatedCol: 'parent_id',
  orderBy: ['created_at', 'DESC'],
};
