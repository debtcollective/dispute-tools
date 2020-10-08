const JWT = require('jsonwebtoken');
const querystring = require('querystring');
const User = require('$models/User');
const { Sentry, logger } = require('$lib');
const {
  sso: { loginEndpoint, jwtSecret, cookieName },
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
      // handle error
      // TODO: should we remove the cookie?
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

    return await User.findOrCreateUser(payload);
  },

  buildRedirect(url) {
    const query = { redirect_url: url };
    return `${loginEndpoint}?${querystring.encode(query)}`;
  },
};

module.exports = SSO;
