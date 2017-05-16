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
      host: 'smtp.develmail.com',
      port: 25,
      secure: false,
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
    siteURL: `http${process.env.SECURE === 'true' ? 's' : ''}://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
    enableLithium: false,

    // Mailer
    mailers: {
      contactEmail: process.env.CONTACT_EMAIL,
      senderEmail: process.env.SENDER_EMAIL,
      disputesBCCAddresses: [process.env.DISPUTES_EMAIL],
    },

    nodemailer: {
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: process.env.NODEMAILER_SECURE === 'true',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    },

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
