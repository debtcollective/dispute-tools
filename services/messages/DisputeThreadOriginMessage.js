const {
  discourse: { coordinatorRole },
} = require('$config/config');
const DiscourseMessage = require('./DiscourseMessage');

class DisputeThreadOriginMessage extends DiscourseMessage {
  constructor(member, dispute, disputeTool) {
    let subject = `${dispute.readableId} - ${member.name || member.username} - ${
      disputeTool.readableName
    }`;
    const creditor = dispute.creditor();

    if (creditor.name) {
      subject = `${subject} - ${creditor.name}`;
    }

    super(DisputeThreadOriginMessage.name, null, {
      to: member.username,
      from: coordinatorRole,
      subject,
    });

    this.locals = { member };
  }
}

module.exports = DisputeThreadOriginMessage;
