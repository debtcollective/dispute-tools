const DiscourseMessage = require('./DiscourseMessage');

class CompletedDisputeMessage extends DiscourseMessage {
  constructor(dispute) {
    super('CompletedDisputeMessage', dispute.disputeThreadId);

    this.locals = { dispute };
  }
}

module.exports = CompletedDisputeMessage;
