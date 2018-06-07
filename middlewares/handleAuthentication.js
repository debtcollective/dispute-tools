const sso = require('../services/sso');
const Raven = require('../lib/core/raven');
const logger = require('../lib/core/logger');
const { sso: { cookieName } } = require('../config/config');

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

    Raven.captureBreadcrumb('Authenticated', req.user);
    logger.debug(`Authenticated ${req.user.email}`);

    sso.createCookie(req, res);
    // redirect to the requested page, gets rid of the SSO query parameters
    res.redirect(req.path);
  } else if (req.cookies[cookieName]) {
    sso.extractCookie(req, res, next);
  } else {
    next();
  }
};
