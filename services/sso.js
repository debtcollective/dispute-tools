const User = require('$models/User');
const {
  errors: { AuthenticationFailure },
} = require('$lib');
const {
  sso: { jwtSecret, cookieName },
} = require('$config/config');

const sso = {
  // Returns the SSO cookie content or null
  ssoCookie(cookies) {
    return cookies[cookieName];
  },

  extractPayload(ssoCookieContent) {
    // read JWT and decode
    console.log(ssoCookieContent);

    // if JWT invalid throw new AuthenticationFailure();

    return;
  },

  async findOrCreateUser(payload) {
    const externalId = payload.external_id;

    return User.query()
      .where('external_id', externalId)
      .then(async result => {
        let user = result[0];

        // if user is missing, create a new record
        if (!user) {
          user = new User({
            externalId,
          });
        }

        // update user profile
        user.setInfo(payload);
        await user.save();

        return user;
      });
  },

  async currentUser(cookies) {
    const ssoCookieContent = this.ssoCookie(cookies);

    // Early return if there's no session cookie
    if (!ssoCookieContent) {
      return null;
    }

    const payload = this.extractPayload(ssoCookieContent);

    if (payload) {
      const user = await this.findOrCreateUser(payload);

      return user;
    }

    throw new AuthenticationFailure('Invalid sso');
  },
};

module.exports = sso;
