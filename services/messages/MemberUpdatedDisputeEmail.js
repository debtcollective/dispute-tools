const DebtCollectiveMessage = require('./DebtCollectiveMessage');
const {
  mailers: { contactEmail },
} = require('../../config/config');

class MemberUpdatedDisputeEmail extends DebtCollectiveMessage {
  constructor(member, dispute, disputeStatus) {
    super('MemberUpdatedDisputeEmail', {
      to: MemberUpdatedDisputeEmail.to,
      from: `${member.name} <${contactEmail}>`,
      subject: `${member.name} has updated their dispute...`,
    });

    this.locals = { member, dispute, disputeStatus };
  }
}

MemberUpdatedDisputeEmail.to = `The Debt Collective Organizers <${contactEmail}>`;

module.exports = MemberUpdatedDisputeEmail;
