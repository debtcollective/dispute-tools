const DiscourseMessage = require('$services/messages/DiscourseMessage');

class DisputeStatusUpdatedMessage extends DiscourseMessage {
  constructor(dispute, disputeStatus) {
    super(DisputeStatusUpdatedMessage.name, dispute.disputeThreadId, {});

    this.locals = { dispute, disputeStatus };
  }
}

module.exports = DisputeStatusUpdatedMessage;
