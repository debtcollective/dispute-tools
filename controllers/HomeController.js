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

    indexfunction(req, res) {
      res.render('home/index.pug');
    },
  },
});

module.exports = new HomeController();
