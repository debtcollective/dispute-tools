/* globals User, Account, CONFIG, Collective, Dispute, DisputeTool, DisputeAttachment */

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

describe('Dispute', () => {
  let user;
  let collective;
  let tool;

  before(function before(){
    this.timeout(5000);
    user = new User({
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

    return DisputeTool.first().then((dt) => {
      tool = dt;
      return Collective.first().then((result) => {
        collective = result;

        return User.transaction((trx) => {
          return user.transacting(trx).save().then(() => {
            account.userId = user.id;
            account.collectiveId = collective.id;
            return account.transacting(trx).save();
          });
        });
      });
    });
  });

  after(() => {
    return truncate(User, Account);
  });

  it('Should create a valid dispute', () => {
    const dispute = new Dispute({
      userId: user.id,
      disputeToolId: tool.id,
    });

    return dispute.save().then((id) => {
      expect(id[0]).to.be.equal(dispute.id);
    });
  });

  describe('Validations', () => {
    it('Should fail userId validation', () => {
      const dispute = new Dispute({
        disputeToolId: tool.id,
      });

      return dispute.save().catch((err) => {
        expect(err.errors.userId.message).to.be.equal('The userId is required');
      });
    });

    it('Should fail disputeToolId validation', () => {
      const dispute = new Dispute({
        userId: user.id,
      });

      return dispute.save().catch((err) => {
        expect(err.errors.disputeToolId.message).to.be.equal('The disputeToolId is required');
      });
    });
  });

  describe('Instance Methods', () => {
    const dispute = new Dispute();


    it('Should set an option', () => {
      dispute.setOption('A');

      expect(dispute.data.option).to.be.equal('A');
    });

    it('Should set a dispute process id', () => {
      dispute.setDisputeProcess({ process: 1 });

      expect(dispute.data.disputeProcess).to.be.equal(1);
    });

    it('Should set a signature', () => {
      dispute.setSignature('Example Signature');

      expect(dispute.data.signature).to.be.equal('Example Signature');
    });

    it('Should set a form', () => {
      const fieldValues = {
        name: 'Example Name',
        address1: 'Address 1',
        address2: 'Address 2',
      };

      dispute.setForm({ name: 'form-name', fieldValues });

      expect(dispute.data.forms['form-name']).to.be.equal(fieldValues);
    });

    it('Should add an attachment with file path', () => {
      dispute.userId = user.id;
      dispute.disputeToolId = tool.id;

      const filePath = path.join(process.cwd(), 'tests', 'assets', 'hubble.jpg');

      return dispute.save().then(() => {
        return dispute.addAttachment('single-uploader', filePath)
          .then(() => {
            expect(dispute.data.attachments.length).to.be.equal(1);
            expect(dispute.data.attachments[0].id).to.exists;
            expect(dispute.data.attachments[0].path).to.exists;
            expect(dispute.data.attachments[0].thumb).to.exists;
            expect(dispute.data.attachments[0].name).to.be.equal('single-uploader');
          });
      });
    });
  });
});
