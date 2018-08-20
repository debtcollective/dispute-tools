const { expect } = require('chai');
const { CompletedDisputeEmail } = require('../../../services/email');

const { ForMember } = CompletedDisputeEmail;

describe('ContactUsEmail.ForMember', () => {
  let member;
  let dispute;
  before(() => {
    member = { name: 'Mercedes Member', email: 'mercedes@example.com' };
    dispute = { id: 12345 };
  });
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new ForMember(member, dispute);
      expect(email.from).exist;
      expect(email.from).eq(ForMember.from);
    });

    it("should set the to address to the visitor's", () => {
      const email = new ForMember(member, dispute);
      expect(email.to).exist;
      // It has to be the contact email so that SES doesn't get upset we're sending emails from unverified addresses
      expect(email.to).eq(`${member.name} <${member.email}>`);
    });

    it('should set the locals with the passed in member', () => {
      const email = new ForMember(member, dispute);

      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in dispute', () => {
      const email = new ForMember(member, dispute);

      expect(email.locals.dispute).exist;
      expect(email.locals.dispute).eql(dispute);
    });
  });

  describe('render', () => {
    let generalDispute;
    before(() => {
      generalDispute = { id: 1, disputeTool: { readableName: 'General Debt Dispute' } };
    });
    it('should be able to render', () => {
      const email = new ForMember(member, dispute);

      const html = email.render();
      expect(html).exist;
      expect(html).include('To download a copy of your documents');
    });

    it('should render a different email for general debt disputes', () => {
      const html = new ForMember(member, generalDispute).render();
      expect(html).not.include('IF YOUR TAXES ARE BEING SEIZED');
    });
  });
});
