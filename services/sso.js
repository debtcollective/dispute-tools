/* globals CONFIG, User */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { errors: { AuthenticationFailure }, Raven, logger } = require('../lib');
const {
  siteURL,
  sso: { endpoint, secret, jwtSecret, cookieName, cookieDomain },
} = require('../config/config');
const { getSsoUserEnsuringCreated } = require('./users');

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

const cleanPayload = payload => ({
  groups: payload.groups,
  email: payload.email,
  username: payload.username,
  admin: payload.admin === 'true',
  moderator: payload.moderator === 'true',
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
  name: user.name,
  username: user.username,
  admin: user.admin,
  moderator: user.moderator,
  externalId: user.externalId,
  avatarTemplate: user.avatar_template,
});

const sso = {
  validNonce: nonce => nonces[nonce] !== undefined,

  buildRedirect(req, url = req.originalUrl) {
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

  async handlePayload(payload) {
    if (sso.validNonce(payload.nonce)) {
      delete nonces[payload.nonce];

      const user = await getSsoUserEnsuringCreated(payload.external_id);

      user.setInfo(cleanPayload(payload));

      return cleanUser(user);
    }

    throw new AuthenticationFailure();
  },

  createCookie(req, res) {
    // create a JWT cookie for the user so we don't have to authenticate with discourse every time
    const b64jwt = Buffer.from(jwt.sign(cleanUser(req.user), jwtSecret)).toString('base64');

    res.cookie(cookieName, b64jwt, {
      // when the browser session ends
      expires: null,
      httpOnly: true,
      domain: cookieDomain,
    });
  },

  async extractCookie(req, res, next) {
    const decodedCookie = Buffer.from(req.cookies[cookieName], 'base64').toString('utf8');
    try {
      const claim = jwt.verify(decodedCookie, jwtSecret);

      const user = await getSsoUserEnsuringCreated(claim.externalId);

      req.user = cleanUser({ ...claim, ...user });

      Raven.captureBreadcrumb('Authenticated', req.user);
      logger.debug(`Authenticated ${req.user.email}`);

      next();
    } catch (e) {
      Raven.captureException(e);
      logger.error('Unable to verify JWT cookie');
      logger.debug(decodedCookie);
      const err = new AuthenticationFailure();
      err.message = e.message;
      next(err);
    }
  },

  async handleSsoResult(req, res, next) {
    const payload = sso.extractPayload(req.query);
    req.user = await sso.handlePayload(payload);

    return sso.createCookie(req, res, next);
  },
};

module.exports = sso;
