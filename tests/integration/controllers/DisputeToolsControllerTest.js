/* globals DisputeTool, User, Account */

const { expect } = require('chai');
const { createUser, testGetPage, testUnauthenticated, testAllowed } = require('$tests/utils');
const config = require('$config/config');

const urls = config.router.helpers;

describe('DisputeToolsController', () => {
  let user;
  let admin;

  before(async () => {
    user = await createUser();
    admin = await createUser({ admin: true });
  });

  describe('index', () => {
    describe('authorization', () => {
      const index = urls.root.url();
      describe('when unauthenticated', () => {
        it('should allow', () => testAllowed(testGetPage(index)));
      });

      describe('when unprivileged', () => {
        it('should allow', () => testAllowed(testGetPage(index, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testGetPage(index, admin)));
      });
    });
  });

  describe('tool page', () => {
    let url;
    let slugUrl;

    before(async () => {
      const tool = await DisputeTool.first();
      url = urls.tool.url(tool.id);
      slugUrl = urls.tool.url(tool.slug);
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testGetPage(url)));
      });

      describe('when unprivileged', () => {
        it('should allow', () => testAllowed(testGetPage(url, user)));
      });

      describe('when admin', () => {
        it('should allow', () => testAllowed(testGetPage(url, admin)));
      });
    });

    it('should return the tool page when using a slug', async () => {
      const byId = await testGetPage(url, user);
      const bySlug = await testGetPage(slugUrl, user);
      expect(byId.text).include(
        '<input name="disputeToolId" type="hidden" value="11111111-1111-1111-1111-111111111111">',
      );
      expect(bySlug.text).include(
        '<input name="disputeToolId" type="hidden" value="11111111-1111-1111-1111-111111111111">',
      );
    });
  });
});
