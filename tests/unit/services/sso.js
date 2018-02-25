/* globals CONFIG */
const { sso: { jwtSecret, secret } } = CONFIG.env();

const sso = require('../../../services/sso');
const { expect } = require('chai');
const crypto = require('crypto');

describe('sso', () => {
  const req = { user: { email: 'foo@bar.com' } };
  const res = {};

  describe('createCookie', () => {
    it('should set a cookie on the res', () => {
      let passedInCookieName;
      res.cookie = cookieName => {
        passedInCookieName = cookieName;
      };
      sso.createCookie(req, res, () => {});

      expect(passedInCookieName).eq('dispute-tool');
    });

    it('should set a signature using the jwtSecret', () => {
      let jwt;
      res.cookie = (_, b64jwt) => {
        jwt = b64jwt;
      };

      sso.createCookie(req, res, () => {});

      jwt = Buffer.from(jwt, 'base64').toString('utf8');
      jwt = JSON.parse(jwt);
      expect(jwt.sig).exist;
      expect(jwt.sig).eq(
        crypto
          .createHmac('sha256', secret)
          .update(jwtSecret)
          .digest('hex'),
      );
    });

    it('should set a jwt containing the user information', () => {
      let jwt;
      req.user = {
        email: 'foo@bar.com',
        groups: ['dispute-admin'],
        username: 'fooBAr',
        admin: true,
        moderator: false,
      };

      res.cookie = (_, b64jwt) => {
        jwt = b64jwt;
      };

      sso.createCookie(req, res, () => {});

      jwt = Buffer.from(jwt, 'base64').toString('utf8');
      jwt = JSON.parse(jwt);

      Object.keys(req.user).forEach(k => {
        const v = jwt[k];
        expect(v).exist;
        expect(v).eq(req.user[k]);
      });
    });

    it('should ');
  });
});
