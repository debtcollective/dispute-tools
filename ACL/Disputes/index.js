module.exports = {
  Visitor: [
    [false],
    ['show', true],
    ['updateDisputeData', 'addAttachment', 'download', 'setSignature', 'removeAttachment', false],
  ],
  User: [
    ['index', true],
    ['create', true],
    [
      'edit',
      'update',
      'destroy',
      'updateDisputeData',
      'addAttachment',
      'download',
      'setSignature',
      'removeAttachment',
      (req) => {
        return (req.dispute.userId === req.user.id);
      },
    ],
  ],
  Admin: [
    [true],
    ['updateDisputeData', 'addAttachment', 'download', 'setSignature', 'removeAttachment', true],
  ],
};
