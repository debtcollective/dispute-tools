const Email = require('./Email');
const { mailers: { contactEmail } } = require('../../config/config');

class RecurringDonationEmail extends Email {
  constructor(member, amount) {
    super('RecurringDonationEmail', {
      to: `${member.fullname} <${member.email}>`,
      from: RecurringDonationEmail.from,
      subject: 'Thank you for donating to the Debt Syndicate',
    });

    this.locals = { member, amount };
  }
}

RecurringDonationEmail.from = `The Debt Syndicate Organizers <${contactEmail}>`;

module.exports = RecurringDonationEmail;
