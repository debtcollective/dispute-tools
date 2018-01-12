/* globals CONFIG */
if (CONFIG.env().sessions !== false) {
  const redis = require('redis');

  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
  });

  const session = require('express-session');

  const RedisStore = require('connect-redis')(session);

  const redisStoreInstance = new RedisStore({
    client: redisClient,
  });

  const sessionMiddleWare = session({
    resave: false,
    saveUninitialized: true,
    key: CONFIG.env().sessions.key,
    // FIXME: this is not working as expected behind nginx-proxy
    // cookie: {secure: CONFIG.environment === 'production'},
    store: redisStoreInstance,
    secret: CONFIG.env().sessions.secret,
  });

  module.exports = sessionMiddleWare;
} else {
  module.exports = (req, res, next) => {
    next();
  };
}
