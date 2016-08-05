var HomeController = Class('HomeController').inherits(BaseController)({
  beforeActions : [
    {
      before : ['_beforeIndex'],
      actions : ['index']
    }
  ],
  prototype : {
    _beforeIndex : function(req, res, next) {
      logger.info('Before Index');
      next();
    },

    index : function(req, res) {
      res.render('home/index.html', {layout: 'application'});
    },

    // @TODO: remove once Users#new is implemented
    usersNew: function(req, res) {
      res.render('users/new.html', {layout: 'signup'});
    }
  }
});

module.exports = new HomeController();
