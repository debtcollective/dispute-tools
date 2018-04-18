const Email = require('./Email');
const { mailers: { disputesBCCAddress, contactEmail } } = require('../../config/config');

/**
 * Sends a completed dispute email to the member who completed the dispute
 */
class ForMember extends Email {
  /**
   * @param {Object} member The Debt Syndicate member who completed the dispute
   * @param {Object} dispute The complete dispute
   */
  constructor(member, dispute) {
    super('CompletedDisputeEmail.ForMember', {
      to: `${member.name} <${member.email}>`,
      from: ForMember.from,
      subject: 'Your completed dispute documents',
    });

    this.locals = { member, dispute };
  }
}

ForMember.from = `The Debt Syndicate Organizers <${contactEmail}>`;

/**
 * Sends a completed dispute email to the Debt Syndicate organizers
 */
class ForAdmin extends Email {
  /**
   * @param {Object} member The Debt Syndicate member who completed the dispute
   * @param {Object} dispute The complete dispute
   */
  constructor(member, dispute) {
    super('CompletedDisputeEmail.ForAdmin', {
      to: `The Debt Syndicate Organizers <${disputesBCCAddress}>`,
      from: `${member.name} <${contactEmail}>`,
      subject: `${member.name} just completed a dispute`,
    });

    this.locals = { member, dispute };
  }
}

/**
 * Wraps the ForMember and ForAdmin emails to make it more convenient to send both at the same time
 */
class CompletedDisputeEmail {
  /**
   * @param {Object} member The Debt Syndicate member who completed the dispute
   * @param {Object} dispute The complete dispute
   */
  constructor(member, dispute) {
    this.forMember = new ForMember(member, dispute);
    this.forAdmin = new ForAdmin(member, dispute);
  }

  send() {
    return Promise.all([this.forMember.send(), this.forAdmin.send()]);
  }

  toString() {
    return `${this.forAdmin.toString()}\n${this.forMember.toString()}`;
  }
}

CompletedDisputeEmail.ForMember = ForMember;
CompletedDisputeEmail.ForAdmin = ForAdmin;

module.exports = CompletedDisputeEmail;
