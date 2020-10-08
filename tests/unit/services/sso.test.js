const { expect } = require('chai');

describe('SSO', () => {
  let cookies = {};
  const jwtSecret = (process.env.SSO_JWT_SECRET = 'jwt_secret');
  const cookieName = (process.env.SSO_COOKIE_NAME = 'sso_cookie');

  before(() => {
    cookies = {};
  });

  describe('with valid sso cookie', () => {
    it("returns a new user if doesn't exist", () => {
      expect(true).eq(false);
    });

    it('returns a user by external_id', () => {});

    it('returns a user by external_id', () => {});
  });

  describe('with invalid sso cookie', () => {});

  describe('without sso cookie', () => {});
});
