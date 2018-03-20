const { expect } = require('chai');
const { OrganizerUpdatedDisputeEmail } = require('../../../services/email');
const { mailers: { contactEmail } } = require('../../../config/config');

describe('OrganizerUpdatedDisputeEmail', () => {
  const member = { fullname: 'Devon Disputer', email: 'dev.dis@example.com' };
  const dispute = { disputeTool: { name: 'Student Debt Dispute' } };
  const disputeStatus = { comment: 'How great is disputing debt?!' };
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new OrganizerUpdatedDisputeEmail(member, dispute, disputeStatus);
      expect(email.from).exist;
      expect(email.from.slice(-(contactEmail.length + 2))).eq(`<${contactEmail}>`);
    });

    it("should set the to address to the visitor's", () => {
      const email = new OrganizerUpdatedDisputeEmail(member, dispute, disputeStatus);
      expect(email.to).exist;
      expect(email.to).eq(`${member.fullname} <${member.email}>`);
    });

    it('should set the locals with the passed in member', () => {
      const email = new OrganizerUpdatedDisputeEmail(member, {}, {});
      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in dispute', () => {
      const email = new OrganizerUpdatedDisputeEmail({}, dispute, {});
      expect(email.locals.dispute).exist;
      expect(email.locals.dispute).eql(dispute);
    });

    it('should set the locals with the passed in disputeStatus', () => {
      const email = new OrganizerUpdatedDisputeEmail({}, {}, disputeStatus);
      expect(email.locals.disputeStatus).exist;
      expect(email.locals.disputeStatus).eql(disputeStatus);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new OrganizerUpdatedDisputeEmail(member, dispute, disputeStatus);
      const html = email.render();
      expect(html).exist;
      expect(html).include(email.locals.member.fullname);
    });
  });
});
