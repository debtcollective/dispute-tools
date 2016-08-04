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

    index : function(req, res, next) {
      res.render('home/index.html', {layout : 'application', posts : ["1", "2", "3", "4", "5"]});
    },

    noLayout : function(req, res) {
      res.render('home/index.html', {layout : false, posts : ["1", "2", "3", "4", "5"]});
    },
  }
});

module.exports = new HomeController();
