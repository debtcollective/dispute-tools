const mandrillTransport = require('nodemailer-mandrill-transport');

const env = process.env.NODE_ENV || 'development';
const path = require('path');

const config = {
  appName: 'TDC',
  environment: env,

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
    siteURL: `http://localhost:${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      senderEmail: 'no-reply@debtcollective.org',
      disputesBCCAddresses: ['test@example.com'],
    },

    nodemailer: {
      service: 'Gmail',
      auth: {
        user: 'EDIT ME',
        pass: 'EDIT ME',
      },
    },

    loggly: {
      apiKey: 'EDIT ME',
    },

    stripe: {
      private: 'EDIT ME',
      publishable: 'EDIT ME',
    },

    GoogleMaps: {
      key: '',
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
    siteURL: `http://localhost:${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      senderEmail: 'no-reply@debtcollective.org',
      disputesBCCAddresses: ['test@example.com'],
    },

    nodemailer: mandrillTransport({
      port: 587,
      host: 'smtp.mandrillapp.com',
      auth: {
        apiKey: process.env.MANDRILL_KEY,
      },
    }),

    loggly: {
      apiKey: 'EDIT ME',
    },

    stripe: {
      secret: 'EDIT ME sk_test_CgWXBI8DxVg83qjkKF9EWDuB',
      publishable: 'EDIT ME pk_test_SLHYKUBbqjnPFTXYcNrYaNAc',
    },

    GoogleMaps: {
      key: '',
    },
  },
};

config.logFile = path.join(process.cwd(), 'log', `${env}.log`);

config.database = require('./../knexfile.js');

config.middlewares = require('./middlewares.js');

module.exports = config;
