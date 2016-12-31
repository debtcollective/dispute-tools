/* global Class, RestfulController */

const Admin = global.Admin = global.Admin || {};

Admin.TestController = Class(Admin, 'TestController').inherits(RestfulController)({
  prototype: {
    index(req, res) {
      res.render('admin/test.pug');
    },
  },
});

module.exports = new Admin.TestController();
