const { expect } = require('chai');
const { createUser, createDispute } = require('$tests/utils');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');
const DisputeStatus = require('$models/DisputeStatus');

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

  describe('createForDispute', () => {
    it('should create a new DisputeStatus for the passed in dispute', async () => {
      const comment = 'hello!';
      const status = DisputeStatuses.completed;
      const note = 'a note!';
      const notify = false;

      const newStatus = await DisputeStatus.createForDispute(dispute, {
        comment,
        status,
        note,
        notify,
      });

      expect(newStatus.comment).eq(comment);
      expect(newStatus.status).eq(status);
      expect(newStatus.note).eq(note);
      expect(newStatus.notify).eq(notify);
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
