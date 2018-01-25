/* globals CONFIG */

if (CONFIG[CONFIG.environment].sessions !== false) {
  module.exports = require('csurf')();
} else {
  module.exports = (req, res, next) => {
    next();
  };
}
