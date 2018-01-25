/* globals User, Account, CONFIG, Collective, Dispute, DisputeTool, DisputeStatus */

const { expect } = require('chai');

describe('Dispute Status', () => {
  let dispute;
  let collective;

  before(function before() {
    this.timeout(5000);

    let tool;
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

    return DisputeTool.first()
      .then(dt => {
        tool = dt;
        return Collective.queryVisible().then(([result]) => {
          collective = result;

          return User.transaction(trx =>
            user
              .transacting(trx)
              .save()
              .then(() => {
                account.userId = user.id;
                account.collectiveId = collective.id;
                return account.transacting(trx).save();
              }),
          );
        });
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
      status: 'Incomplete',
      comment: 'Incomplete status',
      disputeId: dispute.id,
    });

    return status.save().then(id => {
      expect(id[0]).to.be.equal(status.id);
    });
  });

  describe('Validations', () => {
    it('Should fail when status is invalid', () => {
      const status = new DisputeStatus({
        status: 'Incompleted',
        comment: 'Incomplete status',
        disputeId: dispute.id,
      });

      return status.save().catch(err => {
        expect(err.errors.status.message).to.be.equal('Invalid status');
      });
    });

    it('Should fail when there is no dispute id', () => {
      const status = new DisputeStatus({
        status: 'Incompleted',
        comment: 'Incomplete status',
      });

      return status.save().catch(err => {
        expect(err.errors.disputeId.message).to.be.equal(
          'The disputeId is required',
        );
      });
    });
  });
});
