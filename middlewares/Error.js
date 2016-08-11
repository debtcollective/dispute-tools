/* globals logger */

module.exports = (err, req, res, next) => {
  logger.error(err);
  logger.error(err.stack);

  res.format({
    html() {
      if (err.name) {
        switch (err.name) {
          case 'NotFoundError':

            res.status(404).render('shared/404.pug', {
              message: err.message,
            });

            break;
          case 'ForbiddenError':
            res.status(403).render('shared/500.pug', {
              error: err.stack,
            });

            break;
          default:
            res.status(500).render('shared/500.pug', {
              error: `Error\n\n${JSON.stringify(err)} \n\nStack: ${err.stack}`,
            });

            break;
        }
      }

      return res.status(500).render('shared/500.pug', {
        error: `Error\n\n${JSON.stringify(err)} \n\nStack: ${err.stack}`,
      });
    },
    json() {
      if (err.name) {
        switch (err.name) {
          case 'NotFoundError':
            res.status(404).json({
              error: err.message,
            });

            break;
          case 'ForbiddenError':
            res.status(403).json({
              error: err.message,
            });

            break;
          default:
            res.status(500).json({
              error: err.message,
            });

            break;
        }
      }

      return res.status(500).json({
        error: err.message,
      });
    },
  });
};
