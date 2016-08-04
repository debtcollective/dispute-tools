var RestfulController = Class('RestfulController').inherits('BaseController')({
  prototype : {
    name : null,

    init : function (config){
      BaseController.prototype.init.call(this, config);

      return this;
    },

    index : function(req, res, next) {
      res.send(501, "index Not Implemented");
    },

    show : function(req, res, next) {
      res.send(501, "show Not Implemented");
    },

    new : function(req, res, next) {
      res.send(501, "new Not Implemented");
    },

    create : function(req, res, next) {
      res.send(501, "create Not Implemented");
    },

    update : function(req, res, next) {
      res.send(501, "update Not Implemented");
    },

    destroy : function(req, res, next) {
      res.send(501, "destroy Not Implemented");
    }
  }
});

module.exports = RestfulController;
