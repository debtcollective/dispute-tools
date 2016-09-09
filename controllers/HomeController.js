/* globals Class, BaseController, logger, CONFIG */

const HomeController = Class('HomeController').inherits(BaseController)({
  prototype: {
    _authenticate(req, res, next) {
      if (!req.user) {
        return res.format({
          html() {
            req.flash('info', 'You have to login first.');
            return res.redirect(CONFIG.router.helpers.login.url());
          },
          json() {
            return res.status(403).end();
          },
        });
      }

      return next();
    },

    index(req, res) {
      res.render('home/index.pug');
    },

    about(req, res) {
      res.render('home/about');
    },

    tos(req, res) {
      res.render('home/tos.pug');
    },

    tools(req, res) {
      res.render('home/tools');
    },

    tool(req, res) {
      res.render('home/tool');
    },
  },
});

module.exports = new HomeController();
