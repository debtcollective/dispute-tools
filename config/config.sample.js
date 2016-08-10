var env = process.env.NODE_ENV || 'development';
var path = require('path');

var config = {
  appName : 'TDC',
  environment : env,

  env() {
    return config[config.environment];
  },

  development: {
    port: process.env.PORT || 3000,
    // sessions : false, if you want to disable Redis sessions
    sessions: {
      key: 'session',
      secret: 'EDIT ME ctYArFqrrXy4snywpApkTcfootxsz9Ko',
    },
    siteURL: `http://localhost:3000${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      senderEmail: 'no-reply@debtcollective.org',
    },

    AWS: {
      accessKeyId: '',
      secretAccessKey: '',
    },
  },

  production: {},
  test: {
    port: process.env.PORT || 3000,
    // sessions : false, if you want to disable Redis sessions
    sessions: {
      key: 'session',
      secret: 'EDIT ME ctYArFqrrXy4snywpApkTcfootxsz9Ko',
    },
    siteURL: `http://localhost:3000${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      senderEmail: 'no-reply@debtcollective.org',
    },

    AWS: {
      accessKeyId: '',
      secretAccessKey: '',
    },
  },
};

config.logFile = path.join(process.cwd(), 'log', `${env}.log`);

config.database = require('./../knexfile.js');

config.middlewares = require('./middlewares.js');

module.exports = config;
