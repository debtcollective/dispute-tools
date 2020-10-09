const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const faker = require('faker');
const JWT = require('jsonwebtoken');
const User = require('$models/User');
const SSO = require('$services/sso');
const {
  sso: { jwtSecret, cookieName },
} = require('$config/config');

const expect = chai.expect;
chai.use(sinonChai);

describe('SSO', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('with valid sso cookie', () => {
    it('calls User.findOrCreateUser with sso payload', async () => {
      const payload = {
        externalId: 1,
        admin: false,
        email: faker.internet.email(),
        name: faker.name.findName(),
        username: faker.internet.userName(),
        avatarUrl: faker.image.imageUrl(),
      };
      const cookies = {};
      cookies[cookieName] = JWT.sign(payload, jwtSecret);
      sandbox.stub(User, 'findOrCreateUser').returns(Promise.resolve('ok'));

      await SSO.currentUser(cookies);

      expect(User.findOrCreateUser).to.have.been.calledWith(payload);
    });
  });

  describe('with invalid sso cookie', () => {
    it('returns null', async () => {
      const payload = {
        externalId: 1,
        admin: false,
        email: faker.internet.email(),
        name: faker.name.findName(),
        username: faker.internet.userName(),
        avatarUrl: faker.image.imageUrl(),
      };
      const cookies = {};
      cookies[cookieName] = JWT.sign(payload, 'invalid-secret');

      const result = await SSO.currentUser(cookies);

      expect(result).eq(null);
    });
  });

  describe('without sso cookie', () => {
    it('returns null', async () => {
      const cookies = {};

      const result = await SSO.currentUser(cookies);

      expect(result).eq(null);
    });
  });
});
