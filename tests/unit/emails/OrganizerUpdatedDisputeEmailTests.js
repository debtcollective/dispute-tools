const { expect } = require('chai');
const { OrganizerUpdatedDisputeEmail } = require('../../../services/email');

describe('OrganizerUpdatedDisputeEmail', () => {
  const member = {
    name: 'Devon Disputer',
    username: 'devon-disputer',
    email: 'dev.dis@example.com',
  };
  const from = ['administradora'];
  const dispute = { disputeTool: { name: 'Student Debt Dispute' } };
  const disputeStatus = { comment: 'How great is disputing debt?!' };
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new OrganizerUpdatedDisputeEmail(member, from, dispute, disputeStatus);
      expect(email.from).exist;
      expect(email.from).eql(from);
    });

    it("should set the to address to the visitor's", () => {
      const email = new OrganizerUpdatedDisputeEmail(member, from, dispute, disputeStatus);
      expect(email.to).exist;
      expect(email.to).eq(member.username);
    });

    it('should set the locals with the passed in member', () => {
      const email = new OrganizerUpdatedDisputeEmail(member, [], {}, {});
      expect(email.locals.member).exist;
      expect(email.locals.member).eql(member);
    });

    it('should set the locals with the passed in dispute', () => {
      const email = new OrganizerUpdatedDisputeEmail({}, [], dispute, {});
      expect(email.locals.dispute).exist;
      expect(email.locals.dispute).eql(dispute);
    });

    it('should set the locals with the passed in disputeStatus', () => {
      const email = new OrganizerUpdatedDisputeEmail({}, [], {}, disputeStatus);
      expect(email.locals.disputeStatus).exist;
      expect(email.locals.disputeStatus).eql(disputeStatus);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new OrganizerUpdatedDisputeEmail(member, from, dispute, disputeStatus);
      const md = email.render();
      expect(md).exist;
      expect(md).include(email.locals.member.name);
    });
  });
});
