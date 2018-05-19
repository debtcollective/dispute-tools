const Email = require('./Email');
const { mailers: { contactEmail } } = require('../../config/config');

class RecurringDonationEmail extends Email {
  constructor(member, amount) {
    super('RecurringDonationEmail', {
      to: `${member.name} <${member.email}>`,
      from: RecurringDonationEmail.from,
      subject: 'Thank you for donating to the Debt Collective',
    });

    this.locals = { member, amount };
  }
}

RecurringDonationEmail.from = `The Debt Collective Organizers <${contactEmail}>`;

module.exports = RecurringDonationEmail;
