const { expect } = require('chai');
const { CompletedDisputeEmail } = require('$services/messages');
const {
  mailers: { disputesBCCAddress, contactEmail },
} = require('$config/config');

const { ForAdmin } = CompletedDisputeEmail;

describe('ContactUsEmail.ForAdmin', () => {
  describe('constructor', () => {
    it('should set the to address to the contact email', () => {
      const email = new ForAdmin({ name: 'Mercedes Member' }, { id: 12345 });
      expect(email.to).exist;
      expect(email.to.slice(-(disputesBCCAddress.length + 2))).eq(`<${disputesBCCAddress}>`);
    });

    it("should set the from address to the visitor's", () => {
      const email = new ForAdmin({ name: 'Mercedes Member' }, { id: 12345 });
      expect(email.from).exist;
      // It has to be the contact email so that SES doesn't get upset we're sending emails from unverified addresses
      expect(email.from).eq(`Mercedes Member <${contactEmail}>`);
    });

    it('should set the locals with the passed in member', () => {
      const member = { name: 'Mercedes Member' };
      const email = new ForAdmin(member, { id: 12345 });

      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in dispute', () => {
      const dispute = { id: 12345 };
      const email = new ForAdmin({ name: 'Mercedes Member' }, dispute);

      expect(email.locals.dispute).exist;
      expect(email.locals.dispute).eql(dispute);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new ForAdmin({ name: 'Mercedes Member' }, { id: 12345 });

      const html = email.render();
      expect(html).exist;
      expect(html).include(email.locals.member.name);
      expect(html).include(email.locals.dispute.id);
    });
  });
});
