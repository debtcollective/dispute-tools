if (CONFIG[CONFIG.environment].sessions !== false) {
  var redis = require('redis');

  var redisClient = redis.createClient();

  var session = require('express-session');

  var RedisStore = require('connect-redis')(session);

  var redisStoreInstance = new RedisStore();

  var sessionMiddleWare = session({
    resave : false,
    saveUninitialized : true,
    key : CONFIG[CONFIG.environment].sessions.key,
    store: redisStoreInstance,
    secret: CONFIG[CONFIG.environment].sessions.secret
  });

  module.exports = sessionMiddleWare;
} else {
  module.exports = function(req, res, next) {
    next();
  }
}
