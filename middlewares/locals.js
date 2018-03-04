/* globals CONFIG */
const { sso: { logout } } = CONFIG;

const marked = require('marked');
const { US_STATES } = require('../lib/data');

module.exports = function locals(req, res, next) {
  res.locals.routeMappings = CONFIG.router.mappings;
  // Add an additional property to the logout mapping
  // that references the SSO provider's logout endpoint
  res.locals.routeMappings.logout.sso = {
    url() {
      return logout;
    },
  };
  res.locals.currentURL = req.url;
  res.locals.NODE_ENV = CONFIG.environment;
  res.locals.marked = marked;
  res.locals.US_STATES = US_STATES;

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = CONFIG.stripe.publishable;

  return next();
};
