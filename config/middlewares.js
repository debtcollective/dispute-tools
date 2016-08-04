var middlewares = [
  {
    name : 'CORS',
    path : 'middlewares/cors.js'
  },
  {
    name : 'Cookie Parser',
    path : 'middlewares/cookieParser.js'
  },
  {
    name : 'Body Parser URL',
    path : 'middlewares/bodyParserURL.js'
  },
  {
    name : 'Body Parser JSON',
    path : 'middlewares/bodyParserJSON.js'
  },
  {
    name : 'Method Override',
    path : 'middlewares/MethodOverride.js'
  },
  {
    name : 'Redis',
    path : 'middlewares/redis.js'
  },
  {
    name : 'CSRF',
    path : 'middlewares/CSRF.js'
  },
  {
    name : 'CSRF Error',
    path : 'middlewares/CSRFError.js'
  },
  {
    name : 'Locals',
    path : 'middlewares/locals.js'
  },
  {
    name : 'Flash Messages',
    path : 'middlewares/flashMessages.js'
  },
  {
    name : 'Router',
    path : 'middlewares/Router.js'
  },
  {
    name : 'Error Not Found',
    path : 'middlewares/NotFound.js'
  },
  {
    name : 'Error',
    path : 'middlewares/Error.js'
  }
];

module.exports = middlewares;
