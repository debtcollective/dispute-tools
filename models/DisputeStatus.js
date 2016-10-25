/* globals Krypton, Class, Dispute, DisputeStatus */

const DisputeStatus = Class('DisputeStatus').inherits(Krypton.Model)({
  tableName: 'DisputeStatuses',
  attributes: ['id', 'disputeId', 'status', 'comment', 'notify', 'createdAt', 'updatedAt'],
  statuses: [
    'Incomplete',
    'Completed',
    'In Review',
    'Documents Sent',
    'Update',
    'User Update',
  ],
  validations: {
    disputeId: ['required'],
    status: [
      'required',
      {
        rule(val) {
          if (!DisputeStatus.statuses.includes(val)) {
            throw new Error('Invalid status');
          }
        },
        message: 'Invalid status',
      },
    ],
  },

  prototype: {
    notify: true,
  },
});

module.exports = DisputeStatus;
