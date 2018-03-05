/* globals CONFIG */

const colorize = process.env.WINSTON_COLORIZE || true;

const winston = require('winston');

const transports = [];

transports.push(
  new winston.transports.Console({
    handleExceptions: false,
    json: false,
    colorize,
    timestamp: false,
    stringify: true,
    prettyPrint: true,
    depth: null,
    humanReadableUnhandledException: true,
    showLevel: true,
  }),
);

if (CONFIG.environment === 'production' || CONFIG.environment === 'staging') {
  require('winston-loggly-bulk');

  transports.push(
    new winston.transports.Loggly({
      colorize: false,
      token: CONFIG.loggly.apiKey,
      subdomain: 'empathia',
      tags: ['Winston-NodeJS'],
      json: true,
    }),
  );
}

const logger = new winston.Logger({
  transports,
});

module.exports = logger;

module.exports.stream = {
  write: message => {
    logger.info(message);
  },
};
