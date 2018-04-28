const { expect } = require('chai');
const { MemberUpdatedDisputeEmail } = require('../../../services/email');
const { mailers: { contactEmail } } = require('../../../config/config');

describe('MemberUpdatedDisputeEmail', () => {
  const member = { name: 'Devon Disputer' };
  const dispute = { disputeTool: { name: 'Student Debt Dispute' } };
  const disputeStatus = { comment: 'How great is disputing debt?!' };
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new MemberUpdatedDisputeEmail(member, dispute, disputeStatus);
      expect(email.from).exist;
      expect(email.from.slice(-(contactEmail.length + 2))).eq(`<${contactEmail}>`);
    });

    it("should set the to address to the visitor's", () => {
      const email = new MemberUpdatedDisputeEmail(member, dispute, disputeStatus);
      expect(email.to).exist;
      expect(email.to).eq(`The Debt Collective Organizers <${contactEmail}>`);
    });

    it('should set the locals with the passed in member', () => {
      const email = new MemberUpdatedDisputeEmail(member, {}, {});
      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in dispute', () => {
      const email = new MemberUpdatedDisputeEmail({}, dispute, {});
      expect(email.locals.dispute).exist;
      expect(email.locals.dispute).eql(dispute);
    });

    it('should set the locals with the passed in disputeStatus', () => {
      const email = new MemberUpdatedDisputeEmail({}, {}, disputeStatus);
      expect(email.locals.disputeStatus).exist;
      expect(email.locals.disputeStatus).eql(disputeStatus);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new MemberUpdatedDisputeEmail(member, dispute, disputeStatus);
      const html = email.render();
      expect(html).exist;
      expect(html).include(email.locals.member.name);
    });
  });
});
