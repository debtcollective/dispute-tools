if (CONFIG[CONFIG.environment].sessions === false) {
  return module.exports = function(req, res, next) {
    next();
  }
}

module.exports = function (err, req, res, next) {
  logger.error('CSRF', err, res.locals._csrf);
  next(err);
};
