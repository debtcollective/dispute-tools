const crypto = require('crypto');
const User = require('$models/User');
const {
  errors: { AuthenticationFailure },
} = require('$lib');
const {
  siteURL,
  sso: { endpoint, secret },
} = require('$config/config');

const nonces = {};

const generateNonce = () => ({
  n: crypto.randomBytes(10).readUInt32LE(),
  t: Date.now(),
});

const generateSignature = urlEncoded =>
  crypto
    .createHmac('sha256', secret)
    .update(urlEncoded)
    .digest('hex');

const generateToken = url => {
  const { n, t } = generateNonce();
  nonces[n] = t;
  const payload = `nonce=${n}&return_sso_url=${url}`;
  const b64payload = Buffer.from(payload).toString('base64');
  const urlEncoded = encodeURIComponent(b64payload);
  return `sso=${urlEncoded}&sig=${generateSignature(b64payload)}`;
};

const sso = {
  validNonce: nonce => nonces[nonce] !== undefined,

  buildRedirect(url) {
    return `${endpoint}?${generateToken(`${siteURL}${url}`)}`;
  },

  extractPayload({ sso, sig }) {
    if (generateSignature(decodeURIComponent(sso)) === sig) {
      return Buffer.from(sso, 'base64')
        .toString('utf8')
        .split('&')
        .map(q => q.split('='))
        .reduce((acc, [key, value]) => {
          value = decodeURIComponent(value);
          if (acc[key] !== undefined) {
            if (Array.isArray(acc[key])) {
              acc[key].push(value);
            } else {
              acc[key] = [acc[key], value];
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {});
    }

    throw new AuthenticationFailure();
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

  async handlePayload(payload) {
    if (sso.validNonce(payload.nonce)) {
      delete nonces[payload.nonce];

      const user = await this.findOrCreateUser(payload);

      return user;
    }

    throw new AuthenticationFailure();
  },
};

module.exports = sso;
