/* globals Attachment, DisputeRenderer */

DisputeRenderer.relations = {
  attachments: {
    type: 'HasMany',
    relatedModel: Attachment,
    ownerCol: 'id',
    relatedCol: 'foreign_key',
    scope: ['type', 'DisputeRenderer'],
    orderBy: ['created_at', 'ASC'],
  },
};
