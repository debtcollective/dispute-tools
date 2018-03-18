const config = require('../config/config');
const Router = require('../config/RouteMappings');

const { sso: { logout }, environment, stripe: { publishable } } = config;

const marked = require('marked');
const { US_STATES } = require('../lib/data');

module.exports = function locals(req, res, next) {
  res.locals.routeMappings = Router.mappings;
  // Add an additional property to the logout mapping
  // that references the SSO provider's logout endpoint
  res.locals.routeMappings.logout.sso = {
    url() {
      return logout;
    },
  };
  res.locals.currentURL = req.url;
  res.locals.NODE_ENV = environment;
  res.locals.marked = marked;
  res.locals.US_STATES = US_STATES;
  res.locals.CONFIG = config;

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = publishable;

  return next();
};
