if (CONFIG[CONFIG.environment].sessions === false) {
  return module.exports = function(req, res, next) {
    next();
  }
}

module.exports = require('cookie-parser')(CONFIG[CONFIG.environment].sessions.secret);
