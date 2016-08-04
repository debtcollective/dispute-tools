if (CONFIG[CONFIG.environment].sessions !== false) {
  module.exports = require('csurf')();
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
