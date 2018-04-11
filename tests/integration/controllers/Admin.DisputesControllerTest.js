/* globals CONFIG, Dispute, DisputeTool, User, Account */

const {
  createUser,
  createDispute,
  testGetPage,
  testPutPage,
  testGet,
  testPost,
  testPut,
  testUnauthenticated,
  testAllowed,
  testForbidden,
} = require('../../utils');
const nock = require('nock');
const { expect } = require('chai');

const { router: { helpers: urls }, discourse: { baseUrl: discourse } } = CONFIG;

describe('Admin.DisputesController', () => {
  let user;
  let admin;
  let disputeAdmin;
  let moderator;

  before(async () => {
    user = await createUser();
    admin = await createUser({ admin: true });
    disputeAdmin = await createUser({ groups: ['dispute-admin'] });
    moderator = await createUser({ moderator: true });
  });

  describe('index', () => {
    const url = urls.Admin.Disputes.url();

    describe('authorization', () => {
      before(() => {
        nock(discourse)
          .get('/admin/users/list/active.json')
          .times(2)
          .query(true)
          .reply(200, []);
      });

      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testGetPage(url)));
      });

      describe('when user', () => {
        it('should reject', () => testForbidden(testGetPage(url, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testGetPage(url, admin)));
      });

      describe('when dispute admin', () => {
        it('should allow', () => testAllowed(testGetPage(url, disputeAdmin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testGetPage(url, moderator)));
      });
    });
  });

  describe('update', () => {
    let url;
    const status = {
      comment: 'Test status',
      status: 'Incomplete',
      note: 'test note',
      notify: false,
    };

    before(async () => {
      const dispute = await createDispute(await createUser());
      url = urls.Admin.Disputes.update.url(dispute.id);
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testPutPage(url, status)));
      });

      describe('when user', () => {
        it('should reject', () => testForbidden(testPutPage(url, status, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPutPage(url, status, admin)));
      });

      describe('when dispute admin', () => {
        it('should allow', () => testAllowed(testPutPage(url, status, disputeAdmin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testPutPage(url, status, moderator)));
      });
    });
  });

  describe('updateAdmins', () => {
    let url;

    before(async () => {
      const dispute = await createDispute(await createUser());
      url = urls.Admin.Disputes.updateAdmins.url(dispute.id);
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testForbidden(testPost(url, [])));
      });

      describe('when user', () => {
        it('should reject', () => testForbidden(testPost(url, [], user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPost(url, [], admin)));
      });

      describe('when dispute admin', () => {
        it('should allow', () => testAllowed(testPost(url, [], disputeAdmin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testPost(url, [], moderator)));
      });
    });
  });

  describe('updateDisputeData', () => {
    let url;
    let dispute;

    before(async () => {
      dispute = await createDispute(await createUser());
      url = urls.Admin.Disputes.updateDisputeData.url(dispute.id);
      console.error(url);
    });

    describe('authorization', () => {
      let setForm;
      before(() => {
        setForm = Dispute.prototype.setForm;
        Dispute.prototype.setForm = function setFormMock() {
          return this;
        };
      });

      after(() => {
        Dispute.prototype.setForm = setForm;
      });

      describe('when unauthenticated', () => {
        it('should redirect to login', () => testForbidden(testPut(url, {})));
      });

      describe('when user', () => {
        it('should reject', () => testForbidden(testPut(url, {}, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testPut(url, {}, admin)));
      });

      describe('when dispute admin', () => {
        it('should allow', () => testAllowed(testPut(url, {}, disputeAdmin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testPut(url, {}, moderator)));
      });
    });

    it('should update the form', async () => {
      const body = { formName: 'test-form-name', fieldValues: { foo: 'bar' } };
      await testPut(url, body, disputeAdmin);

      const updatedDispute = await Dispute.findById(dispute.id);
      expect(updatedDispute.data.forms).eql({
        'test-form-name': body.fieldValues,
      });
    });
  });

  describe('getAvailableAdmins', () => {
    let url;

    before(async () => {
      const dispute = await createDispute(await createUser());
      url = urls.Admin.Disputes.getAvailableAdmins.url(dispute.id);

      nock(discourse)
        .get('/groups/dispute-admin/members.json')
        .query(true)
        .times(2)
        .reply(200, {
          members: [
            {
              ...disputeAdmin,
              id: disputeAdmin.externalId,
            },
          ],
          owners: [],
        });
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testForbidden(testGet(url)));
      });

      describe('when user', () => {
        it('should reject', () => testForbidden(testGet(url, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testGet(url, admin)));
      });

      describe('when dispute admin', () => {
        it('should allow', () => testAllowed(testGet(url, disputeAdmin)));
      });

      describe('when moderator', () => {
        it('should reject', () => testForbidden(testGet(url, moderator)));
      });
    });
  });
});
