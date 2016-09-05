/* globals User, DisputeTool, Dispute*/

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
};
