/* globals CONFIG, Collective */

const US_STATES = require('datasets-us-states-names');

module.exports = function locals(req, res, next) {
  if (CONFIG.env().sessions !== false) {
    const token = req.csrfToken();

    res.locals.csrfToken = token;

    if (CONFIG.environment === 'test') {
      res.cookie('XSRF-TOKEN', token);
    }
  }

  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentUser = req.user || null;
  res.locals.currentURL = req.url;

  req.role = (req.user && req.user.role) || 'Visitor';
  res.locals.US_STATES = US_STATES;

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = CONFIG.stripe.publishable;
  res.locals.PAYPAL_ACCOUNT = CONFIG.paypal.account;



  if (!req.user) {
    return Collective.query().then((collectives) => {
      res.locals.COLLECTIVES = collectives;
      next();
    });
  }

  return next();
};
