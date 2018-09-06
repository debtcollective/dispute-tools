const {
  createUser,
  testGet,
  testUnauthenticated,
  testAllowed,
  testForbidden,
} = require('$tests/utils');
const config = require('$config/config');

const {
  router: { helpers: urls },
} = config;

describe('Admin.UsersController', () => {
  let user;
  let admin;

  before(async () => {
    user = await createUser();
    admin = await createUser({ admin: true });
  });

  describe('index', () => {
    let url;

    before(() => {
      url = `${urls.Admin.Users.url()}?externalId=${user.externalId}`;
    });

    describe('authorization', () => {
      describe('when unauthenticated', () => {
        it('should redirect to login', () => testUnauthenticated(testGet(url)));
      });

      describe('when user', () => {
        it('should reject', () => testForbidden(testGet(url, user)));
      });

      describe('when admin', () => {
        // this endpoint is making requests to get user data from discourse
        // right now is failing due Nock not matching the request
        xit('should allow', () => testAllowed(testGet(url, admin)));
      });
    });
  });
});
