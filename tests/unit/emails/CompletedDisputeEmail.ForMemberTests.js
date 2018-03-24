const { expect } = require('chai');
const { CompletedDisputeEmail } = require('../../../services/email');

const { ForMember } = CompletedDisputeEmail;

describe('ContactUsEmail.ForMember', () => {
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new ForMember(
        { fullname: 'Mercedes Member', email: 'mercedes@example.com' },
        { id: 12345 },
      );
      expect(email.from).exist;
      expect(email.from).eq(ForMember.from);
    });

    it("should set the to address to the visitor's", () => {
      const member = { fullname: 'Mercedes Member', email: 'mercedes@example.com' };
      const email = new ForMember(member, { id: 12345 });
      expect(email.to).exist;
      // It has to be the contact email so that SES doesn't get upset we're sending emails from unverified addresses
      expect(email.to).eq(`${member.fullname} <${member.email}>`);
    });

    it('should set the locals with the passed in member', () => {
      const member = { fullname: 'Mercedes Member', email: 'mercedes@example.com' };
      const email = new ForMember(member, { id: 12345 });

      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in dispute', () => {
      const dispute = { id: 12345 };
      const email = new ForMember(
        { fullname: 'Mercedes Member', email: 'mercedes@example.com' },
        dispute,
      );

      expect(email.locals.dispute).exist;
      expect(email.locals.dispute).eql(dispute);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new ForMember(
        { fullname: 'Mercedes Member', email: 'mercedes@example.com' },
        { id: 12345 },
      );

      const html = email.render();
      expect(html).exist;
      expect(html).include('To download a copy of your documents');
    });
  });
});
