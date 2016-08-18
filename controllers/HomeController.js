/* globals Class, BaseController, logger */

const HomeController = Class('HomeController').inherits(BaseController)({
  beforeActions: [
    {
      before: ['_beforeIndex'],
      actions: ['index'],
    },
  ],
  prototype: {
    _beforeIndex(req, res, next) {
      logger.info('Before Index');
      next();
    },

    index(req, res) {
      res.render('home/index.pug');
    },

    tos(req, res) {
      res.render('home/tos.pug');
    },
  },
});

module.exports = new HomeController();
