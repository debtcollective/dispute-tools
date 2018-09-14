/* globals Krypton, Class */
const _ = require('lodash');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');

const DisputeStatus = Class('DisputeStatus').inherits(Krypton.Model)({
  tableName: 'DisputeStatuses',
  attributes: [
    'id',
    'disputeId',
    'status',
    'note',
    'comment',
    'notify',
    'pendingSubmission',
    'createdAt',
    'updatedAt',
  ],
  statuses: _.values(DisputeStatuses),
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

  async createForDispute(dispute, { comment, status, note, notify }) {
    const disputeStatus = new DisputeStatus({
      comment,
      status,
      note,
      disputeId: dispute.id,
      // This is legacy but let's keep storing it for now
      // not sure there's a good reason to remove it right away
      notify: typeof notify === 'boolean' || notify === 'on' || notify === 'yes' ? notify : false,
    });

    await disputeStatus.save();
    return disputeStatus;
  },

  prototype: {
    notify: true,
  },
});

module.exports = DisputeStatus;
