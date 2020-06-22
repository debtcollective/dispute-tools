const { expect } = require('chai');
const sinon = require('sinon');
const uuid = require('uuid');
const path = require('path');
const PrivateAttachmentStorage = require('$models/PrivateAttachmentStorage');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');
const DisputeStatus = require('$models/DisputeStatus');
const Attachment = require('$models/Attachment');
const Dispute = require('$models/Dispute');
const DisputeTool = require('$models/DisputeTool');
const { discourse } = require('$lib');
const { createUser, createDispute, truncate } = require('$tests/utils');
const { wageGarnishmentDisputes } = require('$tests/utils/sampleDisputeData');

describe('Dispute', () => {
  let user;
  let tool;

  before(async () => {
    user = await createUser();
    tool = await DisputeTool.first();
  });

  afterEach(async () => await truncate(Attachment, Dispute));

  describe('findById', () => {
    let dispute;
    beforeEach(async () => {
      try {
        dispute = await createDispute(user);
      } catch (e) {
        console.error(JSON.stringify(e, null, 2));
        throw e;
      }
    });

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
      expect(statuses[0].status).eq(DisputeStatuses.new);
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
        expect.fail(e);
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
    describe('attachments', () => {
      it('should be added', async () => {
        const dispute = await createDispute(user, tool);

        // Add attachment
        const filePath = path.join(process.cwd(), 'tests', 'assets', 'hubble.jpg');
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

        await dispute.addAttachment('single-uploader', filePath);

        expect(dispute.data.attachments.length).to.be.equal(1);
        expect(dispute.data.attachments[0].id).to.exists;
        expect(dispute.data.attachments[0].path).to.exists;
        expect(dispute.data.attachments[0].thumb).to.exists;
        expect(dispute.data.attachments[0].name).to.be.equal('single-uploader');

        PrivateAttachmentStorage.prototype.saveStream.restore();
      });

      it('should be removed', async () => {
        const dispute = await createDispute(user, tool);

        // Add attachment
        const filePath = path.join(process.cwd(), 'tests', 'assets', 'hubble.jpg');
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

        await dispute.addAttachment('single-uploader', filePath);
        PrivateAttachmentStorage.prototype.saveStream.restore();

        // Reload dispute to check attachments
        const [reloadedDispute] = await Dispute.query()
          .where('id', dispute.id)
          .include('attachments');

        expect(reloadedDispute.data.attachments.length).to.be.equal(1);
        await reloadedDispute.removeAttachment(reloadedDispute.data.attachments[0].id);

        expect(reloadedDispute.data.attachments.length).to.be.equal(0);
      });
    });

    describe('creditor', () => {
      describe('general-debt-dispute', () => {
        it('returns creditor information available in the dispute', async () => {
          const tool = await DisputeTool.findBySlug('general-debt-dispute');
          const dispute = await createDispute(user, tool);
          dispute.data = {
            forms: {
              'personal-information-form': {
                'agency-name': 'Creditor name',
                'agency-address': 'Creditor address',
                'agency-city': 'Creditor city',
                'agency-state': 'Creditor state',
                'agency-zip-code': '94115',
              },
            },
          };

          const creditor = dispute.creditor();

          expect(creditor).to.exist;
          expect(creditor.name).to.eq('Creditor name');
          expect(creditor.address).to.eq('Creditor address');
          expect(creditor.city).to.eq('Creditor city');
          expect(creditor.state).to.eq('Creditor state');
          expect(creditor.zip).to.eq('94115');
        });
      });

      describe('credit-report-dispute', () => {
        it('returns creditor information available in the dispute', async () => {
          const tool = await DisputeTool.findBySlug('credit-report-dispute');
          const dispute = await createDispute(user, tool);
          dispute.data = {
            forms: {
              'personal-information-form': {
                currentCreditor: 'Creditor name',
              },
            },
          };

          const creditor = dispute.creditor();

          expect(creditor).to.exist;
          expect(creditor.name).to.eq('Creditor name');
        });
      });

      describe('private-student-loan-dispute', () => {
        it('returns creditor information available in the dispute', async () => {
          const tool = await DisputeTool.findBySlug('private-student-loan-dispute');
          const dispute = await createDispute(user, tool);
          dispute.data = {
            forms: {
              'personal-information-form': {
                'firm-name': 'Creditor name',
                'firm-address': 'Creditor address',
                'firm-city': 'Creditor city',
                'firm-state': 'Creditor state',
                'firm-zip-code': '94115',
              },
            },
          };

          const creditor = dispute.creditor();

          expect(creditor).to.exist;
          expect(creditor.name).to.eq('Creditor name');
          expect(creditor.address).to.eq('Creditor address');
          expect(creditor.city).to.eq('Creditor city');
          expect(creditor.state).to.eq('Creditor state');
          expect(creditor.zip).to.eq('94115');
        });
      });

      describe('default', () => {
        it('returns object with empty name attribute', async () => {
          const tool = await DisputeTool.findBySlug('tax-offset-dispute');
          const dispute = await createDispute(user, tool);

          const creditor = dispute.creditor();

          expect(creditor).to.exist;
          expect(creditor.name).to.eq('');
        });
      });
    });

    describe('search', () => {
      it('returns pagination stats correctly', async () => {
        await createDispute(user);
        await createDispute(user);

        const [disputes, pagination] = await Dispute.search({ name: user.name, perPage: 1 });

        expect(disputes.length).to.eq(1);
        expect(pagination.totalPages).to.eq(2);
        expect(pagination.currentPage).to.eq(1);
      });

      it("should search by the user's name", async () => {
        const dispute = await createDispute(user);

        const [disputes] = await Dispute.search({ name: user.name });
        const disputeIds = disputes.map(dispute => dispute.id);

        expect(disputeIds).to.include(dispute.id);
      });

      it('should search by the dispute human readable id', async () => {
        const dispute = await createDispute(user);

        const [disputes] = await Dispute.search({
          filters: { readable_id: dispute.readableId },
        });
        const disputeIds = disputes.map(dispute => dispute.id);

        expect(disputeIds.length).to.eq(1);
        expect(disputeIds).to.include(dispute.id);
      });

      describe('by dispute status', () => {
        it('should search by the dispute status', async () => {
          const dispute = await createDispute(user);

          const [disputes] = await Dispute.search({ status: dispute.status });
          const disputeIds = disputes.map(dispute => dispute.id);

          expect(disputeIds.length).to.eq(1);
          expect(disputeIds).to.include(dispute.id);
        });
      });

      it('should search by the dispute tool', async () => {
        const dispute = await createDispute(user);

        const [disputes] = await Dispute.search({
          filters: { dispute_tool_id: dispute.disputeToolId },
        });
        const disputeIds = disputes.map(dispute => dispute.id);

        expect(disputeIds).to.include(dispute.id);
      });

      it('should return search given the order filter', async () => {
        const dispute1 = await createDispute(user);
        const dispute2 = await createDispute(user);

        // DESC
        let [disputes] = await Dispute.search({
          filters: { name: user.name },
          order: '-created_at',
        });
        let disputeIds = disputes.map(dispute => dispute.id);

        expect(disputeIds[0]).to.eq(dispute2.id);
        expect(disputeIds[1]).to.eq(dispute1.id);

        // ASC
        [disputes] = await Dispute.search({
          filters: { name: user.name },
          order: 'created_at',
        });
        disputeIds = disputes.map(dispute => dispute.id);

        expect(disputeIds[0]).to.eq(dispute1.id);
        expect(disputeIds[1]).to.eq(dispute2.id);
      });
    });

    describe('updateAdmins', () => {
      let dispute;
      let admin;
      let admin2;
      let admin3;

      let originalTopics;
      let invited;
      let uninvited;

      before(() => {
        originalTopics = { ...discourse.topics };
        discourse.topics.invite = (...args) => Promise.resolve(invited.push(args));
        discourse.topics.removeAllowedUser = (...args) => Promise.resolve(uninvited.push(args));
      });

      beforeEach(async () => {
        dispute = await createDispute(user);
        dispute = await Dispute.findById(dispute.id, '[admins]');
        admin = await createUser({ admin: true });
        admin2 = await createUser({ admin: true });
        admin3 = await createUser({ admin: true });

        invited = [];
        uninvited = [];
      });

      after(() => {
        discourse.topics = originalTopics;
      });

      it('should assign the admin to the dispute', async () => {
        await dispute.updateAdmins([admin.id]);
        const disputeAdmins = await Dispute.knex()('AdminsDisputes').where({
          admin_id: admin.id,
          dispute_id: dispute.id,
        });

        expect(disputeAdmins).to.be.truthy;
        expect(disputeAdmins.length).to.eq(1);
        expect(disputeAdmins.find(da => da.admin_id === admin.id)).to.be.defined;
      });

      it('should invite the admin to the dispute thread', async () => {
        await dispute.updateAdmins([admin.id, admin2.id]);
        expect(invited).to.have.lengthOf(2);

        const [threadId1, { user: user1 }] = invited[0];
        expect(threadId1).eq(dispute.disputeThreadId);
        expect(user1).eq(admin.username);

        const [threadId2, { user: user2 }] = invited[1];
        expect(threadId2).eq(dispute.disputeThreadId);
        expect(user2).eq(admin2.username);
      });

      it('should remove the admin from being assigned to the dispute', async () => {
        await dispute.updateAdmins([admin.id, admin2.id]);
        dispute = await Dispute.findById(dispute.id, '[admins]');

        await dispute.updateAdmins([]);
        const disputeAdmins = await Dispute.knex()('AdminsDisputes').where({
          admin_id: admin.id,
          dispute_id: dispute.id,
        });

        expect(disputeAdmins.length).to.eq(0);
        expect(disputeAdmins.find(da => da.admin_id === admin.id)).to.be.undefined;
      });

      it('should remove the admin from the dispute thread', async () => {
        await dispute.updateAdmins([admin.id, admin2.id]);
        expect(uninvited).to.have.lengthOf(0);
        dispute = await Dispute.findById(dispute.id, '[admins]');

        await dispute.updateAdmins([admin3.id]);

        expect(uninvited).to.have.lengthOf(2);

        const [threadId1, user1] = uninvited[0];
        expect(threadId1).eq(dispute.disputeThreadId);
        expect(user1).eq(admin.username);

        const [threadId2, user2] = uninvited[1];
        expect(threadId2).eq(dispute.disputeThreadId);
        expect(user2).eq(admin2.username);
      });
    });
  });
});
