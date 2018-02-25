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
    disableActivation: true,

    siteURL: `http://localhost:${process.env.PORT || 3000}`,

    sso: {
      endpoint: 'http://localhost:3000/session/sso_provider',
      secret: 'super secret string of something',
      jwtSecret: 'another super secret',
    },

    mailers: {
      contactEmail: 'contact@example.com',
      senderEmail: 'no-reply@example.com',
      disputesBCCAddresses: ['disputes@example.com'],
    },

    nodemailer: {
      host: 'localhost',
      port: 1025,
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

    sentry: '',

    GoogleMaps: {
      key: '',
    },

    aws: {
      bucket: '',
      secrets: {
        accessKeyId: '',
        secretAccessKey: '',
        region: '',
      },
    },
  },

  production: {},

  // NOTE:
  // since this file is being copied on CI
  // all values should be taken from ENV

  test: {
    port: process.env.PORT || 3000,
    siteURL: `http${process.env.SECURE === 'true' ? 's' : ''}://${process.env.HOST ||
      'localhost'}:${process.env.PORT || 3000}`,

    sso: {
      endpoint: '',
      secret: 'super secret string of something',
      jwtSecret: 'another super secret',
    },

    // Mailer
    mailers: {
      contactEmail: process.env.CONTACT_EMAIL || 'contact@example.com',
      senderEmail: process.env.SENDER_EMAIL || 'no-reply@example.com',
      disputesBCCAddresses: [process.env.DISPUTES_EMAIL || 'disputes@example.com'],
    },

    nodemailer: {
      host: process.env.NODEMAILER_HOST || 'localhost',
      port: process.env.NODEMAILER_PORT || 1025,
      secure: process.env.NODEMAILER_SECURE === 'true',
      auth: {
        user: process.env.NODEMAILER_USER || '',
        pass: process.env.NODEMAILER_PASS || '',
      },
    },

    loggly: {
      apiKey: process.env.LOGGLY_KEY,
    },

    stripe: {
      secret: process.env.STRIPE_SECRET,
      publishable: process.env.STRIPE_PUBLISHABLE,
    },

    sentry: '',

    GoogleMaps: {
      key: process.env.GMAPS_KEY || 'AIzaSyBDLCXvaAlILavXUE_THISISFAKEKEY',
    },

    aws: {
      bucket: process.env.AWS_BUCKET,
      secrets: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        // Region is required so we can request signed urls that expire for downloads
        region: process.env.AWS_REGION || 'us-east-2',
      },
    },
  },
};

config.logFile = path.join(process.cwd(), 'log', `${env}.log`);

config.database = require('./../knexfile.js');

config.middlewares = require('./middlewares.js');

module.exports = config;
