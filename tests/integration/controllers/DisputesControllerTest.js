/* globals CONFIG, Dispute, DisputeTool, User, Account */

const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');

const {
  createUser,
  createDispute,
  testGetPage,
  testPostPage,
  testPutPage,
  testDeletePage,
  testUnauthenticated,
  testAllowed,
  testForbidden,
  testBadRequest,
  testOk,
} = require('../../utils');
const { MemberUpdatedDisputeEmail } = require('../../../services/email');
const PrivateAttachmentStorage = require('../../../models/PrivateAttachmentStorage');

const urls = CONFIG.router.helpers;

describe('DisputesController', () => {
  let user;
  let admin;
  let moderator;

  before(async () => {
    user = await createUser();
    admin = await createUser({ admin: true });
    moderator = await createUser({ moderator: true });
  });

  describe('show', () => {
    let url;
    let owner;

    before(async () => {
      owner = await createUser();
      const dispute = await createDispute(owner);
      url = urls.Disputes.show.url(dispute.id);
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testGetPage(url)));
      });

      describe('when owner', () => {
        it('should allow', () => testAllowed(testGetPage(url, owner)));
      });

      describe('when user but not owner', () => {
        it('should reject', () => testForbidden(testGetPage(url, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testGetPage(url, admin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testGetPage(url, moderator)));
      });
    });
  });

  describe('update', () => {
    let url;
    let owner;
    let send;
    let dispute;

    before(async () => {
      owner = await createUser();
      dispute = await createDispute(owner);
      url = urls.Disputes.update.url(dispute.id);

      send = MemberUpdatedDisputeEmail.prototype.send;
      MemberUpdatedDisputeEmail.prototype.send = () => Promise.resolve();
    });

    after(() => {
      MemberUpdatedDisputeEmail.prototype.send = send;
    });

    describe('authorization', () => {
      const body = { comment: 'hello' };
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testPutPage(url, body)));
      });

      describe('when owner', () => {
        it('should allow', () => testAllowed(testPutPage(url, body, owner)));
      });

      describe('when user but not owner', () => {
        it('should reject', () => testForbidden(testPutPage(url, body, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPutPage(url, body, admin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testPutPage(url, body, moderator)));
      });
    });

    it('should set the status to User Update', async () => {
      await testPutPage(url, { comment: 'Something such' }, admin);
      const { statuses } = await Dispute.findById(dispute.id, '[statuses]');
      const updatedStatus = statuses.find(s => s.comment === 'Something such');
      expect(updatedStatus).exist;
      expect(updatedStatus.status).eq('User Update');
    });
  });

  describe('create', () => {
    const url = urls.Disputes.create.url();
    let validBody;
    let bodyNoToolId;
    let bodyNoOption;

    before(async () => {
      const tool = await DisputeTool.first();
      validBody = {
        disputeToolId: tool.id,
        option: 'none',
      };
      bodyNoToolId = {
        option: 'none',
      };
      bodyNoOption = {
        disputeToolId: tool.id,
      };
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testPostPage(url)));
      });

      describe('when user', () => {
        it('should allow', () => testAllowed(testPostPage(url, validBody, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPostPage(url, validBody, admin)));
      });

      describe('when moderator', () => {
        it('should allow', () => testAllowed(testPostPage(url, validBody, moderator)));
      });
    });

    describe('model validation', () => {
      it('should require the disputeToolId', () =>
        testBadRequest(testPostPage(url, bodyNoToolId, user)));

      it('should require the option', () => testBadRequest(testPostPage(url, bodyNoOption, user)));
    });
  });

  describe('updateDisputeData', () => {
    let url;
    let owner;
    let dispute;
    const body = {
      command: 'setDisputeProcess',
      process: 'fooBar',
    };
    const setFormBody = {
      command: 'setForm',
      name: 'the-form',
      fieldValues: {
        name: 'name',
        address1: 'address 1 street',
      },
    };

    before(async () => {
      owner = await createUser();
      dispute = await createDispute(owner);
      url = urls.Disputes.updateDisputeData.url(dispute.id);
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testPutPage(url)));
      });

      describe('when owner', () => {
        it('should allow', () => testAllowed(testPutPage(url, body, owner)));
      });

      describe('when user but not owner', () => {
        it('should reject', () => testForbidden(testPutPage(url, body, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPutPage(url, body, admin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testPutPage(url, body, moderator)));
      });
    });

    describe('model validation', () => {
      it('should require a command', () => testBadRequest(testPutPage(url, {}, owner)));
      it('should allow setDisputeProcess', () => testOk(testPutPage(url, body, owner)));
      it('should allow setForm', () => testOk(testPutPage(url, setFormBody, owner)));
      it('should require a valid command', () =>
        testBadRequest(testPutPage(url, { command: 'bogus' }, owner)));

      // This test sucks. I wish this endpoint wasn't implemented this way.
      it('should catch errors inside the command execution', () =>
        testPutPage(url, { command: 'setDisputeProcess' }, owner).catch(err => {
          expect(err.status).eq(302);
          expect(err.response.headers.location).eq(urls.Disputes.show.url(dispute.id));
        }));
    });
  });

  describe('addAttachment', () => {
    let url;
    let owner;
    const assetPath = path.join(process.cwd(), 'tests/assets/hubble.jpg');
    const attach = req => req.attach('attachment', assetPath);

    before(async () => {
      owner = await createUser();
      const dispute = await createDispute(owner);
      url = urls.Disputes.addAttachment.url(dispute.id);

      try {
        // Prevent uploading files to S3
        sinon.stub(PrivateAttachmentStorage.prototype, 'saveStream').returns(
          Promise.resolve({
            original: {
              ext: 'jpeg',
              mimeType: 'image/jpeg',
              width: 1280,
              height: 1335,
              key: 'test/DisputeAttachment/6595579a-b170-4ffd-87b3-2439f3d032fc/file/original.jpeg',
            },
          }),
        );
      } catch (e) {
        if (e.message !== 'Attempted to wrap saveStream which is already wrapped') throw e;
      }
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(attach(testPostPage(url))));
      });

      describe('when owner', () => {
        it('should allow', () => testAllowed(attach(testPostPage(url, null, owner))));
      });

      describe('when user but not owner', () => {
        it('should reject', () => testForbidden(attach(testPostPage(url, null, user))));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(attach(testPostPage(url, null, admin))));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(attach(testPostPage(url, null, moderator))));
      });
    });

    describe('model validation', () => {
      it('should allow attaching multiple files', () =>
        testAllowed(attach(attach(testPostPage(url, null, owner)))));

      it('should require an attachment', () => testBadRequest(testPostPage(url, null, owner)));
    });
  });

  describe('destroy', () => {
    let url;
    let owner;
    let dispute;

    before(async () => {
      owner = await createUser();
    });

    beforeEach(async () => {
      dispute = await createDispute(owner);
      url = urls.Disputes.destroy.url(dispute.id);
    });

    describe('authorization', () => {
      beforeEach(async () => {
        dispute = await createDispute(owner);
        url = urls.Disputes.destroy.url(dispute.id);
      });
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testDeletePage(url)));
      });

      describe('when owner', () => {
        it('should allow', () => testAllowed(testDeletePage(url, owner)));
      });

      describe('when user but not owner', () => {
        it('should reject', () => testForbidden(testDeletePage(url, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testDeletePage(url, admin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testDeletePage(url, moderator)));
      });
    });

    it('should deactivate the dispute', async () => {
      await testDeletePage(url, owner);
      const found = await Dispute.findById(dispute.id);
      expect(found.deactivated).true;
    });
  });

  describe('setSignature', () => {
    let url;
    let owner;
    const body = {
      signature: 'some signature',
    };

    before(async () => {
      owner = await createUser();
      const dispute = await createDispute(owner);
      url = urls.Disputes.setSignature.url(dispute.id);
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testPutPage(url, body)));
      });

      describe('when owner', () => {
        it('should allow', () => testAllowed(testPutPage(url, body, owner)));
      });

      describe('when user but not owner', () => {
        it('should reject', () => testForbidden(testPutPage(url, body, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPutPage(url, body, admin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testPutPage(url, body, moderator)));
      });
    });

    describe('model validation', () => {
      it('should require a signature', () => testBadRequest(testPutPage(url, {}, owner)));
    });
  });
});
