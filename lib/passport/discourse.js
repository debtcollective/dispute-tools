const PassportStrategy = require('passport-strategy');
const sso = require('$services/sso');
const { Sentry } = require('$lib');

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
        Sentry.captureException(e);
        return this.fail('handlePayload error');
      }

      this.success(user);
    } else {
      this.fail('Invalid sig');
    }
  }
}

module.exports = DiscourseStrategy;
