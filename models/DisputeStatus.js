/* globals Krypton, Class, Dispute, DisputeStatus, logger */

const EmailSendingError = require('../lib/errors/EmailSendingFailureError');
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

  async createForDispute(dispute, { comment, status, note, notify }) {
    const disputeStatus = new DisputeStatus({
      comment,
      status,
      note,
      disputeId: dispute.id,
      notify: typeof notify === 'boolean' ? notify : false,
    });

    await disputeStatus.save();

    if (!disputeStatus.notify) {
      return;
    }

    const email = new OrganizerUpdatedDisputeEmail(dispute.user, dispute, disputeStatus);
    try {
      await email.send();
      logger.info('Successfully sent OrganizerUpdatedDisputeEmail', email.toString());
    } catch (e) {
      logger.error(
        'Failed to send OrganizerUpdatedDisputeEmail',
        e.message,
        e.stack,
        email.toString(),
      );
      throw new EmailSendingError(e);
    }
  },

  prototype: {
    notify: true,
  },
});

module.exports = DisputeStatus;
