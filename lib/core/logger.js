/* globals CONFIG */

const colorize = process.env.WINSTON_COLORIZE || true;

const winston = require('winston');

const transports = [
  new winston.transports.File({
    filename: CONFIG.logFile,
    handleExceptions: false,
    colorize: false,
    maxsize: 5242880,
    maxFiles: 10,
    json: true,
  }),
];

if (CONFIG.environment !== 'test') {
  transports.push(new winston.transports.Console({
    handleExceptions: false,
    json: false,
    colorize,
    timestamp: false,
    stringify: true,
    prettyPrint: true,
    depth: null,
    humanReadableUnhandledException: true,
    showLevel: true,
  }));
}

const logger = new winston.Logger({
  transports,
});

module.exports = logger;

module.exports.stream = {
  write: (message, encoding) => {
    logger.info(message);
  },
};
