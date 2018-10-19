const expect = require('chai').expect;
const config = require('$config/config');
const { createUser, testGetPage } = require('$tests/utils');

describe('SessionsController', () => {
  describe('create', () => {
    describe('when unauthenticated', () => {
      it('should redirect to discourse', () => {
        const url = config.router.helpers.login.url();
        const req = testGetPage(url);

        // check redirection to sso
        return req.redirects(0).catch(({ status, response: { headers } }) => {
          expect(status).eq(302);
          expect(headers.location.startsWith(config.sso.endpoint)).true;
        });
      });
    });

    describe('when authenticated', () => {
      it('should redirect to discourse', async () => {
        const user = await createUser();
        const url = config.router.helpers.login.url();
        const req = testGetPage(url, user);

        return req.redirects(0).catch(({ status, response: { headers } }) => {
          expect(status).eq(302);
          expect(headers.location.startsWith(config.sso.endpoint)).true;
        });
      });
    });
  });

  describe('destroy', () => {
    it('should logout user and redirect to root', async () => {
      const user = await createUser();
      const url = config.router.helpers.logout.url();
      const req = testGetPage(url, user);

      return req.redirects(0).catch(({ status, response: { headers } }) => {
        expect(status).eq(302);
        expect(headers.location).eq(config.router.helpers.root.url());
      });
    });
  });
});
