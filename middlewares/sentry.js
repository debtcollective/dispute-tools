/* globals logger */
const CONFIG = require('../config/config');
const Raven = require('raven');

if (CONFIG[CONFIG.environment].sentry) {
  logger.info('Raven enabled');
  Raven.config(CONFIG[CONFIG.environment].sentry).install();
  module.exports = Raven.requestHandler();
} else {
  module.exports = (req, res, next) => next();
}
