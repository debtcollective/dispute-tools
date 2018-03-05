/* globals CONFIG, Collective */

module.exports = function locals(req, res, next) {
  res.locals.currentUser = req.user || null;
  req.role = (req.user && req.user.role) || 'Visitor';

  return next();
};
