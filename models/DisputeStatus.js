/* globals Krypton, Class, Dispute, DisputeStatus */

const DisputeStatuses = require('../shared/enum/DisputeStatuses');
const { OrganizerUpdatedDisputeEmail } = require('../services/email');
const _ = require('lodash');

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

  async createForDispute(dispute, disputeAdmin, { comment, status, note, notify }) {
    const disputeStatus = new DisputeStatus({
      comment,
      status,
      note,
      disputeId: dispute.id,
      notify: typeof notify === 'boolean' || notify === 'on' ? notify : false,
    });

    await disputeStatus.save();

    if (!disputeStatus.notify) {
      return;
    }

    const { assigned: assignedAdmins } = await dispute.getAssignedAndAvailableAdmins();

    const email = new OrganizerUpdatedDisputeEmail(
      dispute.user,
      [disputeAdmin.username, ...assignedAdmins.map(u => u.username)],
      dispute,
      disputeStatus,
    );
    return email.send();
  },

  prototype: {
    notify: true,
  },
});

module.exports = DisputeStatus;
