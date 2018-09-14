const { discourse } = require('$lib');
const {
  discourse: { coordinatorRole },
} = require('$config/config');
const DiscourseMessage = require('./DiscourseMessage');

class DisputeThreadOriginMessage extends DiscourseMessage {
  constructor(member, dispute, disputeTool) {
    super(DisputeThreadOriginMessage.name, null, {
      to: member.username,
      from: coordinatorRole,
      subject: `${dispute.readableId} - ${member.name} - ${disputeTool.readableName}`,
    });

    this.locals = { member };
  }
}

module.exports = DisputeThreadOriginMessage;
