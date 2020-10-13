const JWT = require('jsonwebtoken');
const querystring = require('querystring');
const User = require('$models/User');
const { Sentry, logger } = require('$lib');
const {
  sso: { loginURL, jwtSecret, cookieName },
} = require('$config/config');

const SSO = {
  // Returns the SSO cookie content or null
  ssoCookie(cookies = {}) {
    return cookies[cookieName];
  },

  extractPayload(ssoCookieContent) {
    try {
      // read JWT and decode
      return JWT.verify(ssoCookieContent, jwtSecret, { algorithms: ['HS256'] });
    } catch (e) {
      // report error to Sentry, this means we assigned a cookie with an invalid jwt secret
      Sentry.captureException(e);
      logger.error('Invalid JWT token', e);

      return null;
    }
  },

  async currentUser(cookies) {
    const ssoCookieContent = this.ssoCookie(cookies);
    if (!ssoCookieContent) {
      return null;
    }

    const payload = this.extractPayload(ssoCookieContent);
    if (!payload) {
      return null;
    }

    // JWT adds iat to the payload
    // eslint-disable-next-line no-unused-vars
    const { iat, ...userPayload } = payload;

    return User.findOrCreateUser(userPayload);
  },

  buildRedirect(url) {
    const query = { return_url: url };
    return `${loginURL}?${querystring.encode(query)}`;
  },
};

module.exports = SSO;
