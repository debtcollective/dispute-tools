var stateNames = require('datasets-us-states-names');

module.exports = function(req, res, next) {
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
  res.locals.stateNames = stateNames;

  req.role = req.user && req.user.role || 'Visitor';

  next();
}
