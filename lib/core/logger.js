var winston = require('winston');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: false,
      json: false,
      colorize : true,
      timestamp : false,
      stringify: true,
      prettyPrint : true,
      depth : null,
      humanReadableUnhandledException : true,
      showLevel : true,

    }),
    new winston.transports.File({
      filename: CONFIG.logFile,
      handleExceptions: false,
      colorize: false,
      maxsize : 5242880,
      maxFiles : 10,
      json : true,

    })
  ],
  // exitOnError: false
});

module.exports = logger;

module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};
