/* globals CONFIG */
if (CONFIG.env().sessions !== false) {
  const redis = require('redis');

  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
  });

  const session = require('express-session');

  const RedisStore = require('connect-redis')(session);

  const redisStoreInstance = new RedisStore();

  const sessionMiddleWare = session({
    resave: false,
    saveUninitialized: true,
    key: CONFIG.env().sessions.key,
    store: redisStoreInstance,
    secret: CONFIG.env().sessions.secret
  });

  module.exports = sessionMiddleWare;
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
