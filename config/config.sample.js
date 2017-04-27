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

    sessions: {
      key: 'session',
      secret: 'SECRET',
    },

    siteURL: `http://localhost:${process.env.PORT || 3000}`,
    enableLithium: false,

    mailers: {
      contactEmail: 'contact@example.com',
      senderEmail: 'no-reply@example.com',
      disputesBCCAddresses: ['disputes@example.com'],
    },

    nodemailer: {
      service: 'Gmail',
      auth: {
        user: '',
        pass: '',
      },
    },

    loggly: {
      apiKey: '',
    },

    stripe: {
      private: '',
      publishable: '',
    },

    airbrake: {
      projectId: 10,
      projectKey: 'changeme',
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
    siteURL: `http${process.env.SECURE === 'true' ? 's' : ''}://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
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
