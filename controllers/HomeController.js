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
