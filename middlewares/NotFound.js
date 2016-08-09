module.exports = function(err, req, res, next) {
  res.status(404);
  res.render('shared/404.pug');
};
