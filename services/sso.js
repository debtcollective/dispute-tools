/* globals CONFIG, User */

const moment = require('moment');
const crypto = require('crypto');

const { siteURL, sso: { endpoint, secret, jwtSecret } } = CONFIG.env();
const nonces = {};

// 1hr
// const nonceExpiration = 3600000;

const validNonce = nonce => nonces[nonce] !== undefined;

const generateNonce = () => ({
  n: crypto.randomBytes(10).readUInt32LE(),
  t: Date.now(),
});

const generateSignature = urlEncoded =>
  crypto
    .createHmac('sha256', secret)
    .update(urlEncoded)
    .digest('hex');

const cleanPayload = payload => ({
  groups: payload.groups,
  email: payload.email,
  username: payload.username,
  admin: payload.admin === 'true',
  moderator: payload.moderator === 'false',
});

const generateToken = url => {
  const { n, t } = generateNonce();
  nonces[n] = t;
  const payload = `nonce=${n}&return_sso_url=${url}`;
  const b64payload = Buffer.from(payload).toString('base64');
  const urlEncoded = encodeURIComponent(b64payload);
  return `sso=${urlEncoded}&sig=${generateSignature(b64payload)}`;
};

const cleanUser = user => ({
  id: user.id,
  groups: user.groups,
  email: user.email,
  username: user.username,
  admin: user.admin,
  moderator: user.moderator,
  externalId: user.externalId,
});

module.exports = {
  buildRedirect(req) {
    return `${endpoint}?${generateToken(`${siteURL}${req.originalUrl}`)}`;
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

    throw new Error('Authentication failed!');
  },

  async handlePayload(payload) {
    if (validNonce(payload.nonce)) {
      let [user] = await User.query()
        .where('external_id', payload.external_id)
        .limit(1);

      if (!user) {
        user = new User({
          externalId: payload.external_id,
        });
        await user.save();
      }

      user.setInfo(cleanPayload(payload));

      return user;
    }
  },

  createCookie(req, res, next) {
    // create a JWT cookie for the user so we don't have to authenticate with discourse every time
    const json = JSON.stringify(
      Object.assign(
        {
          sig: generateSignature(jwtSecret),
        },
        cleanUser(req.user),
      ),
    );

    const b64jwt = Buffer.from(json).toString('base64');

    res.cookie('dispute-tool', b64jwt, {
      maxAge: moment()
        .add(1, 'd')
        .valueOf(),
    });

    next();
  },

  extractCookie(req, res, next) {
    const cookie = req.cookies['dispute-tool'];
    const jwt = Buffer.from(cookie, 'base64').toString('utf8');
    const claim = JSON.parse(jwt);
    if (claim.sig === generateSignature(jwtSecret)) {
      req.user = cleanUser(claim);
      next();
    } else {
      next(new Error('Authentication failed!'));
    }
  },
};
