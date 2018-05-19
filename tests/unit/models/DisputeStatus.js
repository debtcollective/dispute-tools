/* globals User, Account, CONFIG, Dispute, DisputeTool, DisputeStatus */

const { expect } = require('chai');
const { createUser, createDispute } = require('../../utils');
const DisputeStatuses = require('../../../shared/enum/DisputeStatuses');
const { OrganizerUpdatedDisputeEmail } = require('../../../services/email');

describe('Dispute Status', () => {
  let dispute;
  let user;

  before(async () => {
    user = await createUser();
    dispute = await createDispute(user);
    dispute.user = user;
  });

  it('Should create an new status', () => {
    const status = new DisputeStatus({
      status: DisputeStatuses.incomplete,
      comment: 'Incomplete status',
      disputeId: dispute.id,
    });

    return status.save().then(id => {
      expect(id[0]).to.be.equal(status.id);
    });
  });

  describe('notify', () => {
    let called;
    let send;
    let getAssignedAndAvailableAdmins;

    before(() => {
      send = OrganizerUpdatedDisputeEmail.prototype.send;
      OrganizerUpdatedDisputeEmail.prototype.send = function send() {
        called = true;
      };

      getAssignedAndAvailableAdmins = Dispute.prototype.getAssignedAndAvailableAdmins;
      Dispute.prototype.getAssignedAndAvailableAdmins = () =>
        Promise.resolve({ assigned: [], available: [] });
    });

    beforeEach(() => {
      called = false;
    });

    after(() => {
      OrganizerUpdatedDisputeEmail.prototype.send = send;
      Dispute.prototype.getAssignedAndAvailableAdmins = getAssignedAndAvailableAdmins;
    });

    describe('when true', () => {
      it('should cause an email alerting the user of the status change to be sent', async () => {
        await DisputeStatus.createForDispute(
          dispute,
          {},
          {
            comment: 'Test comment',
            status: DisputeStatuses.inReview,
            note: 'Just a friendly note',
            notify: 'on',
          },
        );

        expect(called).to.be.true;
      });
    });

    describe('when false', () => {
      it('should not cause an email alerting the user of the status change to be sent', async () => {
        await DisputeStatus.createForDispute(
          dispute,
          {},
          {
            comment: 'Test comment',
            status: DisputeStatuses.inReview,
            note: 'Just a friendly note',
            notify: 'off',
          },
        );

        expect(called).to.be.false;
      });
    });
  });

  describe('Validations', () => {
    it('Should fail when status is invalid', () => {
      const status = new DisputeStatus({
        status: 'NONSENSE BEEP BOOP ERRRRROR',
        comment: 'Incomplete status',
        disputeId: dispute.id,
      });

      return status.save().catch(err => {
        expect(err.errors.status.message).to.be.equal('Invalid status');
      });
    });

    it('Should fail when there is no dispute id', () => {
      const status = new DisputeStatus({
        status: DisputeStatuses.incomplete,
        comment: 'Incomplete status',
      });

      return status.save().catch(err => {
        expect(err.errors.disputeId.message).to.be.equal('The disputeId is required');
      });
    });
  });
});
