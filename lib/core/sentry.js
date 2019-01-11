const Sentry = require('@sentry/node');
const { sentryEndpoint, environment } = require('$config/config');

Sentry.init({
  dsn: sentryEndpoint,
  environment,
});

module.exports = Sentry;
