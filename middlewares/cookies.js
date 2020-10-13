const config = require('$config/config');
const cookieParser = require('cookie-parser');

module.exports = cookieParser(config.sessions.secret);
