var BaseController = Class('BaseController').includes(CustomEventSupport)({
  beforeActions : [],
  prototype : {
    init : function (config){
      this.name = this.constructor.className.replace('Controller', '');

      return this;
    }
  }
});

module.exports = BaseController;
