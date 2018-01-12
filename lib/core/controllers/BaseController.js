/* globals Class, CustomEventSupport */

const BaseController = Class('BaseController').includes(CustomEventSupport)({
  beforeActions: [],
  prototype: {
    init() {
      this.name = this.constructor.className.replace('Controller', '');

      return this;
    },
  },
});

module.exports = BaseController;
