/* globals User, DisputeTool, Dispute, DisputeAttachment, DisputeStatus*/

Dispute.relations = {
  user: {
    type: 'HasOne',
    relatedModel: User,
    ownerCol: 'user_id',
    relatedCol: 'id',
  },

  tool: {
    type: 'HasOne',
    relatedModel: DisputeTool,
    ownerCol: 'dispute_tool_id',
    relatedCol: 'id',
  },

  attachments: {
    type: 'HasMany',
    relatedModel: DisputeAttachment,
    ownerCol: 'id',
    relatedCol: 'dispute_id',
    orderBy: ['created_at', 'ASC'],
  },

  statuses: {
    type: 'HasMany',
    relatedModel: DisputeStatus,
    ownerCol: 'id',
    relatedCol: 'dispute_id',
    orderBy: ['created_at', 'DESC'],
  },
};
