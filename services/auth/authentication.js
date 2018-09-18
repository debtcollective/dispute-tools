const config = require('$config/config');

/**
 * This service closely matches the middleware {@link handleAuthentication}.
 * While the authentication middleware's responsibility is to ensure that
 * `req.user` is populated as early as possible (when possible), it does not
 * ensure that a user is authenticated before accessing a route. In the interest
 * of easy-to-understand permission policies, this service can be injected using
 * the `beforeActions` directive on a controller. It will force the requester to
 * authenticate before continuing the route. It will only work on GETs as the
 * redirect back will be a GET. This is unavoidable. Fortunately, the way the
 * platform is currently written this isn't actually a big problem as we will
 * not have any situations where a requester will be performing any other method
 * than GET as their first pass at an authenticate route.
 */
module.exports = async (req, res, next) => {
  if (!req.user) {
    res.format({
      html() {
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
