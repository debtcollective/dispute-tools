/* globals KBPost, KBTopic */

KBPost.relations = {
  topic: {
    type: 'HasOne',
    relatedModel: KBTopic,
    ownerCol: 'topic_id',
    relatedCol: 'id',
  },
};
