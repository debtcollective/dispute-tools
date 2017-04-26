/* globals CONFIG, Collective */

module.exports = function locals(req, res, next) {
  if (CONFIG.env().sessions !== false) {
    const token = req.csrfToken && req.csrfToken();

    res.locals.csrfToken = token;

    if (CONFIG.environment === 'test') {
      res.cookie('XSRF-TOKEN', token);
    }
  }

  res.locals.currentUser = req.user || null;
  req.role = (req.user && req.user.role) || 'Visitor';

  return next();
};
