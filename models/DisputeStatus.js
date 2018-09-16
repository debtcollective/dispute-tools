/* globals Krypton, Class */
const _ = require('lodash');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');
const { notifyStatuses } = require('$config/config');
const { DisputeStatusUpdatedMessage } = require('$services/messages');

const DisputeStatus = Class('DisputeStatus').inherits(Krypton.Model)({
  tableName: 'DisputeStatuses',
  attributes: [
    'id',
    'disputeId',
    'status',
    'note',
    'comment',
    'pendingSubmission',
    'createdAt',
    'updatedAt',
  ],

  statuses: _.values(DisputeStatuses),
  notifyStatuses,

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

  async createForDispute(dispute, { comment, status, note }) {
    const disputeStatus = new DisputeStatus({
      comment,
      status,
      note,
      disputeId: dispute.id,
    });

    await disputeStatus.save();

    if (DisputeStatus.notifyStatuses.includes(status)) {
      // Don't need to await this
      new DisputeStatusUpdatedMessage(dispute, disputeStatus).safeSend();
    }

    return disputeStatus;
  },

  prototype: {
    notify: true,
  },
});

module.exports = DisputeStatus;
