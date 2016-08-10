module.exports = function(req, res, next) {
  if (CONFIG.env().sessions !== false) {
    const token = req.csrfToken();

    res.locals.csrfToken = token;

    if (CONFIG.environment === 'test') {
      res.cookie('XSRF-TOKEN', token);
    }

  }

  res.locals.routeMappings = CONFIG.router.mappings;
  res.locals.currentUser = req.user;
  res.locals.currentURL = req.url;

  next();
}
