/* globals KBPost, Topic */

KBPost.relations = {
  topic: {
    type: 'HasOne',
    relatedModel: Topic,
    ownerCol: 'topic_id',
    relatedCol: 'id',
  },
};
