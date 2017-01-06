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

  if (req.ban) {
    req.flash('error', 'This account is currently suspended. Contact us if you think this is a mistake.');
    res.redirect(CONFIG.router.helpers.login.url());
    return;
  }

  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentUser = req.user || null;
  res.locals.currentURL = req.url;

  req.role = (req.user && req.user.role) || 'Visitor';
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
