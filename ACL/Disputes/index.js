module.exports = {
  Visitor: [
    [false],
    ['updateDisputeData', 'addAttachment', false],
  ],
  User: [
    [false],
    ['create', true],
    ['show', 'edit', 'update', 'destroy', 'updateDisputeData', 'addAttachment', (req) => {
      if (req.dispute.userId === req.user.id) {
        return true;
      }

      return false;
    }],
  ],
  Admin: [
    [true],
    ['updateDisputeData', 'addAttachment', false],
  ],
};
