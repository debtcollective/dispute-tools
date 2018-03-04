/* globals CONFIG */
const { sso: { cookieName } } = CONFIG;

const sso = require('../services/sso');

/**
 * Authentication middleware that will attempt to populate
 * `req.user` as early in the request lifecycle as possible
 * ensuring that all services down the line have access to it
 * @param {e.Request} req Express Request
 * @param {e.Response} res Express Response
 * @param {e.Next} next Express Next
 */
module.exports = async (req, res, next) => {
  if (req.query.sig && req.query.sso) {
    const payload = sso.extractPayload(req.query);
    req.user = await sso.handlePayload(payload);

    sso.createCookie(req, res, next);
  } else if (req.cookies[cookieName]) {
    sso.extractCookie(req, res, next);
  } else {
    next();
  }
};
