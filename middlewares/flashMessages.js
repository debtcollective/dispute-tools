const { sessions } = require('../config/config').env();

if (sessions) {
  module.exports = require('req-flash')({ locals: 'flash' });
} else {
  module.exports = (req, res, next) => next();
}
