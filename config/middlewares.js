const middlewares = [
  {
    name: 'Authentication handler',
    path: 'middlewares/handleAuthentication.js',
  },
  {
    name: 'CORS',
    path: 'middlewares/cors.js',
  },
  {
    name: 'Body Parser URL',
    path: 'middlewares/bodyParserURL.js',
  },
  {
    name: 'Body Parser JSON',
    path: 'middlewares/bodyParserJSON.js',
  },
  {
    name: 'Multipart Body Parser',
    path: 'middlewares/multer.js',
  },
  {
    name: 'Method Override',
    path: 'middlewares/MethodOverride.js',
  },
  {
    name: 'Locals',
    path: 'middlewares/locals.js',
  },
  {
    name: 'Flash Messages',
    path: 'middlewares/flashMessages.js',
  },
  {
    name: 'SafeLocals',
    path: 'middlewares/SafeLocals.js',
  },
  {
    name: 'ResponseTime',
    path: 'middlewares/ResponseTime.js',
  },
  {
    name: 'Router',
    path: 'middlewares/Router.js',
  },
  {
    name: 'Error',
    path: 'middlewares/Error.js',
  },
];

module.exports = middlewares;
