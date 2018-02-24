/* globals User, Account, CONFIG, Dispute, DisputeTool, DisputeStatus */

const { expect } = require('chai');
const DisputeStatuses = require('../../../shared/enum/DisputeStatuses');

describe('Dispute Status', () => {
  let dispute;

  before(async function before() {
    this.timeout(5000);

    const [tool] = await DisputeTool.query().limit(1);
    const user = new User({
      email: 'user@example.com',
      password: '12345678',
      role: 'Admin',
    });

    const account = new Account({
      fullname: 'Example Account Name',
      bio: '',
      state: 'Texas',
      zip: '73301',
    });

    return user
      .save()
      .then(() => {
        account.userId = user.id;
        return account.save();
      })
      .then(() => {
        dispute = new Dispute({
          userId: user.id,
          disputeToolId: tool.id,
        });

        return dispute.save();
      });
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
    let _mailer;
    let called;
    before(() => {
      _mailer = global.DisputeMailer;
      global.DisputeMailer = {
        sendStatusToUser() {
          called = true;
        },
      };
    });

    beforeEach(() => {
      called = false;
    });

    after(() => {
      global.UserMailer = _mailer;
    });

    it(', when true, should cause an email alerting the user of the status change to be sent', async () => {
      await DisputeStatus.createForDispute(dispute, {
        comment: 'Test comment',
        status: DisputeStatuses.update,
        note: 'Just a friendly note',
        notify: true,
      });

      expect(called).to.be.true;
    });

    it(', when false, should not cause an email alerting the user of the status change to be sent', async () => {
      await DisputeStatus.createForDispute(dispute, {
        comment: 'Test comment',
        status: DisputeStatuses.update,
        note: 'Just a friendly note',
        notify: false,
      });

      expect(called).to.be.false;
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
