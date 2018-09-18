/* globals logger, CONFIG */

const { ForbiddenError, AuthenticationFailure, NotFoundError, BadRequest } = require('$lib/errors');

// Needs four parameters so that Express knows it's an error handler
// eslint-disable-next-line
module.exports = (err, req, res, next) => {
  let status;

  if (err instanceof ForbiddenError) {
    status = 403;
  } else if (err instanceof AuthenticationFailure) {
    status = 401;
  } else if (err instanceof NotFoundError) {
    status = 404;
  } else if (err instanceof BadRequest) {
    status = 400;
  } else {
    status = 500;
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
