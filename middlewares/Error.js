/* globals logger, CONFIG */

module.exports = (err, req, res, next) => {
  logger.error(err);

  let status;

  if (err.name) {
    switch (err.name) {
      case 'NotFoundError':
        status = 404;
        break;
      case 'ForbiddenError':
        status = 403;
        break;
      default:
        status = 500;
        break;
    }
  }

  res.status(status);

  const options = {
    message: err.message || '',
    error: `Error\n\n${JSON.stringify(err)}`,
  };

  if (['development', 'test'].indexOf(CONFIG.environment) !== -1) {
    options.error = `Error\n\n${JSON.stringify(err)} \n\nStack: ${err.stack}`;
  }

  res.format({
    html() {
      res.render(`shared/${status}.pug`, options);
    },
    json() {
      res.json(options);
    },
  });
};
