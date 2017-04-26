if (CONFIG.env().sessions === false) {
  return module.exports = function(req, res, next) {
    next();
  }
}

module.exports = require('cookie-parser')(CONFIG.env().sessions.secret, {secure: CONFIG.environment === 'production'});
