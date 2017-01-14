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
      secret: 'EDIT ME',
    },
    siteURL: `http://localhost:${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      contactEmail: 'EDIT ME',
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

    airbrake: {
      projectId: 0,
      projectKey: '',
    },

    GoogleMaps: {
      key: '',
    },
  },

  production: {},

  // NOTE:
  // since this file is being copied on CI
  // all values should be taken from ENV

  test: {
    port: process.env.PORT || 3000,
    sessions: {
      key: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
    },
    siteURL: `http${process.env.SECURE === 'TRUE' ? 's' : ''}://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      contactEmail: process.env.CONTACT_EMAIL,
      senderEmail: process.env.SENDER_EMAIL,
      disputesBCCAddresses: [process.env.DISPUTES_EMAIL],
    },

    nodemailer: mandrillTransport({
      port: 587,
      host: 'smtp.mandrillapp.com',
      auth: {
        apiKey: process.env.MANDRILL_KEY,
      },
    }),

    loggly: {
      apiKey: process.env.LOGGLY_KEY,
    },

    stripe: {
      secret: process.env.STRIPE_SECRET,
      publishable: process.env.STRIPE_PUBLISHABLE,
    },

    airbrake: {
      projectId: process.env.AIRBRAKE_ID,
      projectKey: process.env.AIRBRAKE_KEY,
    },

    GoogleMaps: {
      key: process.env.GMAPS_KEY,
    },
  },
};

config.logFile = path.join(process.cwd(), 'log', `${env}.log`);

config.database = require('./../knexfile.js');

config.middlewares = require('./middlewares.js');

module.exports = config;
