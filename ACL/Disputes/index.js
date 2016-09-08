module.exports = {
  Visitor: [
    [false],
    ['updateDisputeData', 'addAttachment', false],
  ],
  User: [
    ['index', true],
    ['create', true],
    ['show', 'edit', 'update', 'destroy', 'updateDisputeData', 'addAttachment', (req) => {
      return (req.dispute.userId === req.user.id);
    }],
  ],
  Admin: [
    [true],
    // ['updateDisputeData', 'addAttachment', false],
  ],
};
