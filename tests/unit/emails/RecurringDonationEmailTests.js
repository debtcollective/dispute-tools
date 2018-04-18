const { expect } = require('chai');
const { RecurringDonationEmail } = require('../../../services/email');

describe('RecurringDonationEmail', () => {
  const member = { name: 'Devon Donator', email: 'dev.don@example.com' };
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new RecurringDonationEmail(member, 1000);
      expect(email.from).exist;
      expect(email.from).eq(RecurringDonationEmail.from);
    });

    it("should set the to address to the visitor's", () => {
      const email = new RecurringDonationEmail(member, 1000);
      expect(email.to).exist;
      expect(email.to).eq(`${member.name} <${member.email}>`);
    });

    it('should set the locals with the passed in member', () => {
      const email = new RecurringDonationEmail(member, 1000);
      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in amount', () => {
      const email = new RecurringDonationEmail({}, 1000, {});
      expect(email.locals.amount).exist;
      expect(email.locals.amount).eq(1000);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new RecurringDonationEmail(member, 1000);
      const html = email.render();
      expect(html).exist;
      expect(html).include('Thanks for your donation to Debt Syndicate');
    });
  });
});
