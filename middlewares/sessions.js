const session = require('express-session');
const config = require('$config/config');

// expire in 1 day
const maxAge = 1 * 86400 * 1000;
const secure = config.environment === 'production';

const sessionMiddleWare = session({
  resave: false,
  saveUninitialized: true,
  key: config.sessions.key,
  cookie: {
    secure,
    maxAge,
  },
  secret: config.sessions.secret,
});

module.exports = sessionMiddleWare;
