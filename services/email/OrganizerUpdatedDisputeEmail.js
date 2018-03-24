const Email = require('./Email');
const { mailers: { contactEmail } } = require('../../config/config');

class OrganizerUpdatedDisputeEmail extends Email {
  constructor(member, dispute, disputeStatus) {
    super('OrganizerUpdatedDisputeEmail', {
      to: `${member.fullname} <${member.email}>`,
      from: OrganizerUpdatedDisputeEmail.from,
      subject: 'A Debt Syndicate organizer has updated the status of your dispute',
    });

    this.locals = { member, dispute, disputeStatus };
  }
}

OrganizerUpdatedDisputeEmail.from = `The Debt Syndicate Organizers <${contactEmail}>`;

module.exports = OrganizerUpdatedDisputeEmail;
