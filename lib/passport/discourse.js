const PassportStrategy = require('passport-strategy');
const sso = require('$services/sso');
const { Sentry } = require('$lib');
const {
  errors: { AuthenticationFailure },
} = require('$lib');

class DiscourseStrategy extends PassportStrategy {
  constructor() {
    super();
    this.name = 'discourse';
  }

  async authenticate(req) {
    if (req.query.sig && req.query.sso) {
      const payload = sso.extractPayload(req.query);
      let user = null;

      try {
        user = await sso.handlePayload(payload);
      } catch (e) {
        if (e instanceof AuthenticationFailure) {
          Sentry.captureMessage(e.message);
        } else {
          Sentry.captureException(e);
        }

        return this.fail(e.message);
      }

      this.success(user);
    } else {
      this.fail('Invalid sig');
    }
  }
}

module.exports = DiscourseStrategy;
