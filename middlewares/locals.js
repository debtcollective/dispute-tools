/* globals CONFIG */

const stateNames = require('datasets-us-states-names');

module.exports = function locals(req, res, next) {
  if (CONFIG.env().sessions !== false) {
    const token = req.csrfToken();

    res.locals.csrfToken = token;

    if (CONFIG.environment === 'test') {
      res.cookie('XSRF-TOKEN', token);
    }
  }

  if (!req.user) {
    res.locals.stateNames = stateNames;
  }

  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentUser = req.user || null;
  res.locals.currentURL = req.url;

  req.role = (req.user && req.user.role) || 'Visitor';

  next();
};
