/* globals User, DisputeTool, Dispute, Attachment, DisputeStatus*/

Dispute.relations = {
  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },

  disputeTool: {
    type: 'HasOne',
    relatedModel: DisputeTool,
    ownerCol: 'dispute_tool_id',
    relatedCol: 'id',
  },

  attachments: {
    type: 'HasMany',
    relatedModel: Attachment,
    ownerCol: 'id',
    relatedCol: 'foreign_key',
    scope: ['type', 'Dispute'],
    orderBy: ['created_at', 'ASC'],
  },

  statuses: {
    type: 'HasMany',
    relatedModel: DisputeStatus,
    ownerCol: 'id',
    relatedCol: 'dispute_id',
    orderBy: ['created_at', 'DESC'],
    scope: ['notify', true],
  },
};
