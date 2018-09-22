/* globals Krypton, Class */
const _ = require('lodash');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');
const { notifyStatuses } = require('$config/config');
const { DisputeStatusUpdatedMessage } = require('$services/messages');
const { logger } = require('$lib');

const DisputeStatus = Class('DisputeStatus').inherits(Krypton.Model)({
  tableName: 'DisputeStatuses',
  attributes: ['id', 'disputeId', 'status', 'note', 'pendingSubmission', 'createdAt', 'updatedAt'],

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

  async createForDispute(dispute, { status, note = '' }) {
    const repeatStatus = _.get(_.head(dispute.statuses), 'status', null) === status;
    const hasNote = !_.isEmpty(_.trim(note));

    if (repeatStatus && !hasNote) {
      logger.error(
        'Invalid status creation. Attempted to create a repeated status with no admin note. [dispute id="%s"] [status="%s"] [note="%s"]',
        dispute.id,
        status,
        note,
      );
      throw new Error('Invalid status creation. Empty note with repeat status.');
    }

    const disputeStatus = new DisputeStatus({
      status,
      note,
      disputeId: dispute.id,
    });

    await disputeStatus.save();

    // Only send notifications when the status is in the list of configured statuses
    // to send notifications for _and_ the status is not a repeat status.
    // This mechanism allows admin notes to be added without accidentally
    // sending notifications to the user if the status didn't change
    const shouldSendNotification = DisputeStatus.notifyStatuses.includes(status) && !repeatStatus;

    if (shouldSendNotification) {
      // Don't need to await this
      new DisputeStatusUpdatedMessage(dispute, disputeStatus).safeSend();
    }

    return disputeStatus;
  },
});

module.exports = DisputeStatus;
