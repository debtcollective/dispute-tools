module.exports = function(err, req, res, next) {
  logger.error(err);
  logger.error(err.stack);

  if (req.knex) {
    req.knex.destroy(function () {});
  }


  res.format({
    html() {
      if (err.name) {
        switch (err.name) {
          case 'NotFoundError':

            return res.status(404).render('shared/404.pug', {
              message: err.message,
            });
            break;
          case 'ForbiddenError':
            return res.status(403).render('shared/500.pug', {
              error: err.stack
            });
            break;
          default:
            return res.status(500).render('shared/500.pug', {
              error: 'Error:\n\n' + JSON.stringify(err) + '\n\nStack:\n\n' + err.stack
            });
            break;
        }
      }
    },
    json() {
      if (err.name) {
        switch (err.name) {
          case 'NotFoundError':
            return res.status(404).json({
              error: err.message,
            });
            break;
          case 'ForbiddenError':
            return res.status(403).json({
              error: err.message
            });
            break;
          default:
            return res.status(500).json({
              error: err.message
            });
            break;
        }
      }
    }
  });
};
