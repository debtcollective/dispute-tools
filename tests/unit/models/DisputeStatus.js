const { expect } = require('chai');
const { createUser, createDispute } = require('$tests/utils');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');
const DisputeStatus = require('$models/DisputeStatus');
const Dispute = require('$models/Dispute');
const { DisputeStatusUpdatedMessage } = require('$services/messages');

describe('Dispute Status', () => {
  let dispute;
  let user;

  before(async () => {
    user = await createUser();
  });

  beforeEach(async () => {
    dispute = await createDispute(user);
    dispute.user = user;
  });

  it('Should create an new status', () => {
    const status = new DisputeStatus({
      status: DisputeStatuses.incomplete,
      disputeId: dispute.id,
    });

    return status.save().then(id => {
      expect(id[0]).to.be.equal(status.id);
    });
  });

  describe('createForDispute', () => {
    it('should create a new DisputeStatus for the passed in dispute', async () => {
      const status = DisputeStatuses.completed;
      const note = 'a note!';

      const newStatus = await DisputeStatus.createForDispute(dispute, {
        status,
        note,
      });

      expect(newStatus.status).eq(status);
      expect(newStatus.note).eq(note);
    });

    it('should keep the same pendingSubmission value from last status', async () => {
      let dispute = await createDispute(user);
      const status = new DisputeStatus({
        status: DisputeStatuses.completed,
        disputeId: dispute.id,
        pendingSubmission: true,
      });

      await status.save();

      // reload dispute
      dispute = await Dispute.findById(dispute.id);

      const newStatus = await DisputeStatus.createForDispute(dispute, {
        status: DisputeStatuses.completed,
        note: 'test note',
      });

      expect(status.pendingSubmission).eq(true);
      expect(newStatus.pendingSubmission).eq(status.pendingSubmission);
    });

    describe('notification', () => {
      let sent;
      let safeSend;
      let notifyStatuses;

      beforeEach(() => {
        safeSend = DisputeStatusUpdatedMessage.prototype.safeSend;
        sent = false;
        DisputeStatusUpdatedMessage.prototype.safeSend = () => (sent = true);
        notifyStatuses = DisputeStatus.notifyStatuses;
      });

      afterEach(() => {
        DisputeStatusUpdatedMessage.prototype.safeSend = safeSend;
        DisputeStatus.notifyStatuses = notifyStatuses;
      });

      it('should send a message when the status is in the notifyStatuses array and the status is not a repeat', async () => {
        // Set the status to incomplete so it's not a repeat status
        await DisputeStatus.createForDispute(dispute, {
          status: DisputeStatuses.incomplete,
          note: '',
        });

        // Set the notify statuses to be just documentsSent
        DisputeStatus.notifyStatuses = [DisputeStatuses.documentsSent];

        // Set the status to documentsSent
        await DisputeStatus.createForDispute(dispute, {
          status: DisputeStatuses.documentsSent,
          note: '',
        });

        expect(sent).eq(true);
      });

      it('should not send a message when the status is a repeat', async () => {
        // Set the notify statuses to be just documents sent
        DisputeStatus.notifyStatuses = [DisputeStatuses.documentsSent];

        // Set the status to documents sent
        await DisputeStatus.createForDispute(dispute, {
          status: DisputeStatuses.documentsSent,
          note: '',
        });

        // Set sent back to false (will have been set to true by setting the status to documentsSent)
        sent = false;

        // re-retrieve the dispute so that the statuses are up to date
        dispute = await Dispute.findById(dispute.id, Dispute.defaultIncludes);

        // set the status to the same as before but with a note so that it
        // doesn't complain about repeat status and no note
        await DisputeStatus.createForDispute(dispute, {
          status: DisputeStatuses.documentsSent,
          note: 'this is a note',
        });

        expect(sent).eq(false);
      });

      it('should not send the message if the status is not in the notifyStatuses array', async () => {
        DisputeStatus.notifyStatuses = [];
        await DisputeStatus.createForDispute(dispute, {
          status: DisputeStatuses.documentsSent,
          note: '',
        });

        expect(sent).eq(false);
      });

      it('should throw an error if repeated status with no note', async () => {
        await DisputeStatus.createForDispute(dispute, {
          status: DisputeStatuses.completed,
          note: '',
        });

        // re-retrieve the dispute so that the statuses are up to date
        dispute = await Dispute.findById(dispute.id, Dispute.defaultIncludes);

        await expect(
          DisputeStatus.createForDispute(dispute, { status: DisputeStatuses.completed, note: '' }),
        ).rejectedWith('Invalid status creation. Empty note with repeat status.');
      });
    });
  });

  describe('Validations', () => {
    it('Should fail when status is invalid', () => {
      const status = new DisputeStatus({
        status: 'NONSENSE BEEP BOOP ERRRRROR',
        disputeId: dispute.id,
      });

      return status.save().catch(err => {
        expect(err.errors.status.message).to.be.equal('Invalid status');
      });
    });

    it('Should fail when there is no dispute id', () => {
      const status = new DisputeStatus({
        status: DisputeStatuses.incomplete,
      });

      return status.save().catch(err => {
        expect(err.errors.disputeId.message).to.be.equal('The disputeId is required');
      });
    });
  });
});
