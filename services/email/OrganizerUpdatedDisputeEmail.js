const DiscourseMessage = require('./DiscourseMessage');

class OrganizerUpdatedDisputeEmail extends DiscourseMessage {
  constructor(member, from, dispute, disputeStatus) {
    super('OrganizerUpdatedDisputeEmail', {
      to: member.username,
      from,
      subject: 'A Debt Collective organizer has updated the status of your dispute',
    });

    this.locals = { member, dispute, disputeStatus };
  }
}

module.exports = OrganizerUpdatedDisputeEmail;
