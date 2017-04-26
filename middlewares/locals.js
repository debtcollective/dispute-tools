/* globals CONFIG, Collective */

const US_STATES = require('datasets-us-states-names');

module.exports = function locals(req, res, next) {
  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentURL = req.url;

  res.locals.US_STATES = US_STATES;

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = CONFIG.env().stripe.publishable;

  if (!req.user) {
    return Collective.query().then((collectives) => {
      res.locals.COLLECTIVES = collectives;
      next();
    });
  }

  return next();
};
