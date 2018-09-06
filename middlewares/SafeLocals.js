/* globals CONFIG, Collective */
module.exports = function locals(req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.isAdmin = req.user && req.user.admin;

  return next();
};
