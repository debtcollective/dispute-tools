/* globals logger, CONFIG */

// prettier-ignore
module.exports = (err, req, res, next) => { // eslint-disable-line
  logger.error(err);

  let status;

  if (err.name) {
    switch (err.name) {
      case 'ForbiddenError':
      case 'NotFoundError':
        status = 404;
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
    showLogin: status === 404 && !req.user,
  };

  if (['development', 'test'].indexOf(CONFIG.environment) !== -1) {
    options.error = `Error\n\n${JSON.stringify(err)} \n\nStack: ${err.stack}`;
  }

  res.format({
    html() {
      res.render(`shared/${status}`, options);
    },
    json() {
      res.json(options);
    },
  });
};
