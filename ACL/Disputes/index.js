module.exports = {
  Visitor: [
    [false],
    ['show', (req) => {
      let allowed = true;

      if (!req.user || (req.user && req.user.id !== req.dispute.userId)) {
        allowed = true;

        if (req.dispute.statuses[0].status === 'Incomplete') {
          allowed = false;
        }
      }

      return allowed;
    }],
    [
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
    ['index', true],
    ['create', true],
    [
      'edit',
      'update',
      'destroy',
      'updateSubmission',
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
    [
      'updateDisputeData',
      'updateSubmission',
      'addAttachment',
      'download',
      'setSignature',
      'removeAttachment',
      true,
    ],
  ],
};
