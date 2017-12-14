/* globals logger */
const { sessions } = require('../config/config').env();

if (sessions === false) {
  module.exports = (req, res, next) => next();
} else {
  module.exports = (err, req, res, next) => {
    logger.error('CSRF', err, res.locals._csrf);
    next(err);
  };
}

