/* globals CONFIG */

const marked = require('marked');
const { US_STATES } = require('../lib/data');
const { sso: { joinUrl, loginUrl, logoutUrl } } = CONFIG.env();

module.exports = function locals(req, res, next) {
  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentURL = req.url;
  res.locals.NODE_ENV = CONFIG.environment;
  res.locals.marked = marked;
  res.locals.US_STATES = US_STATES;
  res.locals.joinUrl = joinUrl;
  res.locals.loginUrl = loginUrl;
  res.locals.logoutUrl = logoutUrl;

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = CONFIG.env().stripe.publishable;

  return next();
};
