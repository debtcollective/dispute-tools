/* globals logger */
const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8080;

const uuid = require('uuid');

module.exports = {
  environment,
  port,
  appName: process.env.APP_NAME || 'TDC Dispute Tools',
  sso: {
    endpoint: process.env.SSO_ENDPOINT || 'http://localhost:3000/session/sso_provider',
    secret: process.env.SSO_SECRET || uuid.v4(),
    jwtSecret: process.env.JWT_SECRET || uuid.v4(),
    cookieName: process.env.SSO_COOKIE_NAME || '_dispute_tools',
  },
  siteURL: process.env.SITE_URL || `http://localhost:${port}`,
  mailers: {
    contactEmail: process.env.EMAIL_CONTACT || 'contact@example.com',
    senderEmail: process.env.EMAIL_NO_REPLY || 'no-reply@example.com',
    disputesBCCAddress: process.env.EMAIL_DISPUTES_BCC || 'disputes@example.com',
  },
  smtp: {
    host: process.env.EMAIL_HOST || 'localhost',
    port: process.env.EMAIL_PORT || 1025,
    secure: process.env.EMAIL_SECURE || false,
    auth: {
      user: process.env.EMAIL_AUTH || '',
      pass: process.env.EMAIL_PASS || '',
    },
  },
  loggly: {
    apiKey: process.env.LOGGLY_KEY || '',
  },
  stripe: {
    private: process.env.STRIPE_PRIVATE || '',
    publishable: process.env.STRIPE_PUBLISHABLE || false,
  },
  googleMaps: {
    apiKey: process.env.GMAPS_KEY || '',
  },
  aws: {
    bucket: process.env.AWS_UPLOAD_BUCKET || 'debt-collective',
    secrets: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_DEFAULT_REGION || '',
    },
    useSes: process.env.USE_SES === 'true',
    staticAssets: process.env.STATIC_ASSETS_BUCKET_URL || 'https://s3.amazonaws.com/tds-static',
  },
  sentryEndpoint: process.env.SENTRY_ENDPOINT || '',
  database: require('./knexfile.sample'),
  middlewares: require('./middlewares'),
};
