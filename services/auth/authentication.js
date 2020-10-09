const config = require('$config/config');

/**
 * Redirects to login if there's no authenticated in user
 * Saves req.url to redirect after login
 */
module.exports = async (req, res, next) => {
  if (!req.user) {
    res.format({
      html() {
        // save redirectTo
        req.session.redirectTo = `${req.protocol}://${req.headers.host}${req.url}`;

        return res.redirect(config.router.mappings.login.url());
      },
      json() {
        return res.status(403).end();
      },
    });
  } else {
    next();
  }
};
