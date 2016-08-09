module.exports = function(req, res) {
  res.status(404);
  res.render('shared/404.pug');
};
