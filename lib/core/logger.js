/* globals CONFIG */

const colorize = process.env.WINSTON_COLORIZE || true;
const level = CONFIG.environment === 'development' ? 'debug' : 'info';

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
    level,
  }),
);

if (
  (CONFIG.environment === 'production' || CONFIG.environment === 'staging') &&
  CONFIG.loggly.apiKey
) {
  const { Loggly } = require('winston-loggly-bulk');

  transports.push(
    new Loggly({
      colorize: false,
      token: CONFIG.loggly.apiKey,
      subdomain: 'debtcollective',
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
