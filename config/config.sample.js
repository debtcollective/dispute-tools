/* globals logger */
const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8080;

module.exports = {
  environment,
  port,
  appName: process.env.APP_NAME || 'TDC Dispute Tools',
  sso: {
    endpoint: process.env.SSO_ENDPOINT || 'http://localhost:3000/session/sso_provider',
    secret: process.env.SSO_SECRET || 'this is the sso secret',
    jwtSecret: process.env.JWT_SECRET || 'this is the jwt secret',
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
  discourse: {
    apiKey: process.env.DISCOURSE_API_KEY || '',
    apiUsername: process.env.DISCOURSE_API_USERNAME || 'system',
    baseUrl: process.env.DISCOURSE_API_BASE_URL || 'http://localhost:3000',
  },
  doeDisclosure: {
    representatives:
      process.env.DOE_DISCLOSURE_REPRESENTATIVES || 'Admin One, Admin Two, Admin Three',
    phones: process.env.DOE_DISCLOSURE_PHONES || '(555) 555-5555, (555) 551-5555, (555) 552-5555',
    relationship: process.env.DOE_DISCLOSURE_RELATIONSHIP || 'Organizers with the Debt Collective',
    address: process.env.DOE_DISCLOSURE_ADDRESS || '123 DOE Disclosure Lane',
    city: process.env.DOE_DISCLOSURE_CITY || 'Anchorage',
    state: process.env.DOE_DISCLOSURE_STATE || 'Alaska',
    zip: process.env.DOE_DISCLOSURE_ZIP || '12345',
  },
  database: require('./knexfile.sample'),
  middlewares: require('./middlewares'),
};
