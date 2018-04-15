/* globals User, CONFIG, DisputeStatus, Dispute, DisputeTool, Attachment */

const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const uuid = require('uuid');
const PrivateAttachmentStorage = require('../../../models/PrivateAttachmentStorage');
const { createUser, createDispute, truncate } = require('../../utils');
const DisputeStatuses = require('../../../shared/enum/DisputeStatuses');
const { wageGarnishmentDisputes } = require('../../utils/sampleDisputeData');

describe('Dispute', () => {
  let user;
  let tool;

  before(async () => {
    user = await createUser();
    tool = await DisputeTool.first();
  });

  describe('findById', () => {
    let dispute;
    beforeEach(async () => {
      dispute = await createDispute(user);
    });

    afterEach(() => truncate(Dispute));

    it('should return the dispute by its id', async () => {
      const found = await Dispute.findById(dispute.id);
      expect(found).exist;
      expect(found.id).eq(dispute.id);
    });

    it('should return undefined when no dispute exists for the id', async () => {
      const found = await Dispute.findById(uuid.v4());
      expect(found).not.exist;
    });
  });

  describe('createFromTool', () => {
    let dispute;
    beforeEach(async () => {
      dispute = await Dispute.createFromTool({
        user,
        disputeToolId: tool.id,
        option: 'none',
      });
    });
    it('should create a dispute for the passed in tool id', async () => {
      expect(dispute.disputeToolId).eq(tool.id);
    });

    it('should create a dispute for the passed in user', async () => {
      expect(dispute.userId).eq(user.id);
    });

    it('should create a dispute with the passed in option', async () => {
      expect(dispute.data.option).eq('none');
    });

    it('should create a dispute with a default status', async () => {
      const statuses = await DisputeStatus.query().where('dispute_id', dispute.id);
      expect(statuses.length).eq(1);
      expect(statuses[0].status).eq(DisputeStatuses.incomplete);
    });
  });

  describe('Validations', () => {
    it('Should fail userId validation', () => {
      const dispute = new Dispute({
        disputeToolId: tool.id,
      });

      return dispute.save().catch(err => {
        expect(err.errors.userId.message).to.be.equal('The userId is required');
      });
    });

    it('Should fail disputeToolId validation', () => {
      const dispute = new Dispute({
        userId: user.id,
      });

      return dispute.save().catch(err => {
        expect(err.errors.disputeToolId.message).to.be.equal('The disputeToolId is required');
      });
    });
  });

  describe('setOption', () => {
    let dispute;
    before(async () => {
      dispute = await createDispute(user);
    });

    it('should set the option property on the dispute data', () => {
      const option = uuid.v4();
      dispute.setOption(option);
      expect(dispute.data.option).eq(option);
    });
  });

  describe('setSignature', () => {
    let dispute;
    before(async () => {
      dispute = await createDispute(user);
    });

    it('should set the signature on the dispute data', async () => {
      const signature = uuid.v4();
      await dispute.setSignature(signature);
      expect(dispute.data.signature).eq(signature);
    });
  });

  describe('setDisputeProcess', () => {
    let dispute;
    before(async () => {
      dispute = await createDispute(user);
    });

    it('should set the dispute process on the dispute data', async () => {
      const process = uuid.v4();
      await dispute.setDisputeProcess({ process });
      expect(dispute.data.disputeProcess).eq(process);
    });

    it('should set the dispute process city on the dispute data', async () => {
      const process = uuid.v4();
      const processCity = uuid.v4();
      await dispute.setDisputeProcess({ process, processCity });
      expect(dispute.data.disputeProcessCity).eq(processCity);
    });
  });

  describe('setConfirmFollowUp', () => {
    let dispute;
    before(async () => {
      dispute = await createDispute(user);
    });

    it('should set disputeConfirmFollowUp to true on the dispute data', () => {
      dispute.data.disputeConfirmFollowUp = false;
      dispute.setConfirmFollowUp();
      expect(dispute.data.disputeConfirmFollowUp).true;
    });
  });

  describe('setForm', () => {
    let dispute;
    before(async () => {
      dispute = await createDispute(user);
    });

    it('should require a form name', async () => {
      let caught;
      try {
        await dispute.setForm({ fieldValues: {}, _isDirty: false });
      } catch (e) {
        caught = e;
      }
      expect(caught).exist;
    });

    it('should set the form', async () => {
      const fieldValues = wageGarnishmentDisputes.A.data.forms['personal-information-form'];

      dispute.data.option = 'A';

      try {
        await dispute.setForm({ formName: 'form-name', fieldValues });
      } catch (e) {
        console.error(e);
      }

      expect(dispute.data.forms['form-name']).to.be.equal(fieldValues);
    });

    it('should not allow a form missing required fields', async () => {
      const fieldValues = {
        ...wageGarnishmentDisputes.A.data.forms['personal-information-form'],
        'debt-amount': undefined,
      };

      dispute.data.option = 'A';

      let caught;
      try {
        await dispute.setForm({ formName: 'form-name', fieldValues });
      } catch (e) {
        caught = e;
      }

      expect(caught).exist;
      expect(caught.errors['debt-amount'].message).eq('The debt-amount is required');
    });

    it('should toggle required fields that depend on other fields', async () => {
      const fieldValues = {
        ...wageGarnishmentDisputes.A.data.forms['personal-information-form'],
        'ffel-loan-radio-option': 'on',
      };

      dispute.data.option = 'A';

      let caught;
      try {
        await dispute.setForm({ formName: 'form-name', fieldValues });
      } catch (e) {
        caught = e;
      }

      expect(caught).exist;
      expect(caught.errors.guarantyAgency).exist;
      expect(caught.errors.guarantyAgency.errors.find(e => e.rule === 'required')).exist;
    });
  });

  describe('Instance Methods', () => {
    let dispute;

    beforeEach(() => {
      dispute = new Dispute({
        userId: user.id,
        disputeToolId: tool.id,
      });

      return dispute.save().then(([id]) =>
        Dispute.query()
          .where({ id })
          .include('admins')
          .then(([d]) => {
            dispute = d;
            dispute.disputeTool = tool;
          }),
      );
    });

    describe('attachments', () => {
      let disputeId = '';

      it('should be added', () => {
        disputeId = dispute.id;
        dispute.userId = user.id;
        dispute.disputeToolId = tool.id;

        const filePath = path.join(process.cwd(), 'tests', 'assets', 'hubble.jpg');

        // Prevent uploading files to S3
        sinon.stub(PrivateAttachmentStorage.prototype, 'saveStream').returns(
          new Promise(resolve => {
            const response = {
              original: {
                ext: 'jpeg',
                mimeType: 'image/jpeg',
                width: 1280,
                height: 1335,
                key:
                  'test/DisputeAttachment/6595579a-b170-4ffd-87b3-2439f3d032fc/file/original.jpeg',
              },
            };

            resolve(response);
          }),
        );

        return dispute.save().then(() =>
          dispute.addAttachment('single-uploader', filePath).then(() => {
            expect(dispute.data.attachments.length).to.be.equal(1);
            expect(dispute.data.attachments[0].id).to.exists;
            expect(dispute.data.attachments[0].path).to.exists;
            expect(dispute.data.attachments[0].thumb).to.exists;
            expect(dispute.data.attachments[0].name).to.be.equal('single-uploader');

            PrivateAttachmentStorage.prototype.saveStream.restore();
          }),
        );
      });

      it('should be removed', () => {
        dispute.userId = user.id;
        dispute.disputeToolId = tool.id;

        return Dispute.query()
          .where('id', disputeId)
          .include('attachments')
          .then(disputes => {
            dispute = disputes[0];
            const attachmentId = dispute.data.attachments[0].id;

            return dispute.removeAttachment(attachmentId).then(() => {
              expect(dispute.data.attachments.length).to.be.equal(0);
            });
          });
      });
    });

    describe('search', () => {
      const containsDispute = ids => expect(ids).to.contain(dispute.id);

      // TODO Re-enable once discourse sends the person's fullname
      xit("should search by the user's name", () =>
        Dispute.search({ name: user.name }).then(containsDispute));

      it('should search by the dispute human readable id', () =>
        Dispute.search({ filters: { readable_id: dispute.readableId } }).then(containsDispute));

      describe('by dispute status', () => {
        it('should search by the dispute status', () =>
          Dispute.search({ status: dispute.status }).then(containsDispute));

        describe('should ignore', () => {
          let status;
          let disputeId;
          before(async () => {
            disputeId = dispute.id;
            status = new DisputeStatus({
              status: 'In Review',
              notify: false,
              comment: 'asdfasdf',
              disputeId,
            });
            await status.save();
          });

          it('the notify flag', () =>
            Dispute.search({ status: status.status }).then(res => {
              expect(res).to.contain(disputeId);
            }));
        });
      });

      it('should search by the dispute tool', () =>
        Dispute.search({
          filters: { dispute_tool_id: dispute.disputeToolId },
        }).then(containsDispute));

      describe('when given a readable id should ignore', () => {
        const withreadableId = q =>
          Object.assign({ filters: { readable_id: dispute.readableId } }, q);
        it('the name', () =>
          Dispute.search(withreadableId({ name: 'bogus bogus' })).then(containsDispute));

        it('the status', () =>
          Dispute.search(withreadableId({ status: 'not a real status beep boop beeeeeeep' })).then(
            containsDispute,
          ));
      });
    });

    describe('admins', () => {
      describe('updateAdmin', () => {
        it('should assign the admin to the dispute', async () => {
          await dispute.updateAdmins([user.externalId]);
          const disputeAdmins = await Dispute.knex()('AdminsDisputes').where({
            admin_id: user.id,
            dispute_id: dispute.id,
          });

          expect(disputeAdmins).to.be.truthy;
          expect(disputeAdmins.length).to.eq(1);
          expect(disputeAdmins.find(da => da.admin_id === user.id)).to.be.defined;
        });

        it('should remove the admin from being assigned to the dispute', async () => {
          await dispute.updateAdmins([user.externalId]);
          await dispute.updateAdmins([]);
          const disputeAdmins = await Dispute.knex()('AdminsDisputes').where({
            admin_id: user.id,
            dispute_id: dispute.id,
          });

          expect(disputeAdmins.length).to.eq(0);
          expect(disputeAdmins.find(da => da.admin_id === user.id)).to.be.undefined;
        });
      });
    });
  });
});
