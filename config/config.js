var env = process.env.NODE_ENV || 'development';
var path = require('path');

var config = {
  appName : 'debtcollective',
  environment : env,

  development : {
    port : process.env.PORT || 3000,
    // sessions : false, if you want to disable Redis sessions
    sessions       : {
      key      : 'session',
      secret   : 'EDIT ME ctYArFqrrXy4snywpApkTcfootxsz9Ko',
    },
    siteURL : 'http://localhost:3000',
    enableLithium : false
  },

  production : {},
  test : {}
}

config.logFile = path.join(process.cwd(), '/log/' + env + '.log');

config.database        = require('./../knexfile.js');

config.middlewares     = require('./middlewares.js');

module.exports = config;
