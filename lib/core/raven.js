const Raven = require('raven');
const { sentryEndpoint } = require('$config/config');

module.exports = Raven.config(sentryEndpoint).install();
