module.exports = {
  Visitor: [
    [false],
    [
      'show',
      'updateDisputeData',
      'updateSubmission',
      'addAttachment',
      'download',
      'setSignature',
      'removeAttachment',
      false,
    ],
  ],
  User: [
    ['index', 'create', true],
    [
      'show',
      'edit',
      'update',
      'destroy',
      'updateSubmission',
      'updateDisputeData',
      'addAttachment',
      'download',
      'setSignature',
      'removeAttachment',
      (req) => (req.dispute.userId === req.user.id),
    ],
  ],
  Admin: [
    ['download', true],
  ],
};
