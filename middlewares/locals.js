/* globals CONFIG, Collective */

const marked = require('marked');
const { US_STATES } = require('../lib/data');

module.exports = function locals(req, res, next) {
  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentURL = req.url;
  res.locals.NODE_ENV = CONFIG.environment;
  res.locals.marked = marked;
  res.locals.US_STATES = US_STATES;

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = CONFIG.env().stripe.publishable;

  if (!req.user) {
    return Collective.queryVisible().then(collectives => {
      res.locals.COLLECTIVES = collectives;
      next();
    });
  }

  return next();
};
