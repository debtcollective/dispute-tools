const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('$config/config');

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});

const redisStoreInstance = new RedisStore({
  client: redisClient,
});

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
  store: redisStoreInstance,
  secret: config.sessions.secret,
});

module.exports = sessionMiddleWare;
