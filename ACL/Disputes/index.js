module.exports = {
  Visitor: [
    [false],
    ['updateDisputeData', 'addAttachment', 'download', 'setSignature', 'removeAttachment', false],
  ],
  User: [
    ['index', true],
    ['create', true],
    [
      'show',
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
