const { discourse } = require('$lib');
const DiscourseMessage = require('./DiscourseMessage');

class DisputeThreadOriginMessage extends DiscourseMessage {
  constructor(member, dispute, disputeTool) {
    super(DisputeThreadOriginMessage.name, null, {
      to: member.username,
      from: null,
      subject: `${dispute.readableId} - ${member.name} - ${disputeTool.readableName}`,
    });

    this.locals = { member };
  }

  async send() {
    const { members: disputeCoordinators } = await discourse.getDisputeCoordinators();
    this.from = disputeCoordinators.map(u => u.username);
    return super.send();
  }
}

module.exports = DisputeThreadOriginMessage;
