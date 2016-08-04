module.exports = function(err, req, res, next) {
  logger.error(err);
  logger.error(err.stack);

  if (req.knex) {
    req.knex.destroy(function () {});
  }

  if (err.name) {
    switch (err.name) {
      case 'NotFoundError':
        return res.status(404).render('shared/404.html', {
          message: err.message,
          layout: false
        });
        break;
      case 'ForbiddenError':
        return res.status(403).render('shared/500.html', {
          layout: false,
          error: err.stack
        });
        break;
      default:
        break;
    }
  }

  res.status(500);
  res.format({
    html: function () {
      res.render('shared/500.html', {
        layout: false,
        error: 'Error:\n\n' + JSON.stringify(err) + '\n\nStack:\n\n' + err.stack
      });
    },
    json: function () {
      res.json(err);
    }
  });
}
