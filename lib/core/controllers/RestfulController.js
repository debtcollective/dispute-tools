/* globals Class, BaseController */
/* eslint-disable no-unused-vars */

const RestfulController = Class('RestfulController').inherits('BaseController')(
  {
    prototype: {
      name: null,

      init(config) {
        BaseController.prototype.init.call(this, config);

        return this;
      },

      index(req, res, next) {
        res.send(501, 'index Not Implemented');
      },

      show(req, res, next) {
        res.send(501, 'show Not Implemented');
      },

      edit(req, res, next) {
        res.send(501, 'edit Not Implemented');
      },

      new(req, res, next) {
        res.send(501, 'new Not Implemented');
      },

      create(req, res, next) {
        res.send(501, 'create Not Implemented');
      },

      update(req, res, next) {
        res.send(501, 'update Not Implemented');
      },

      destroy(req, res, next) {
        res.send(501, 'destroy Not Implemented');
      },
    },
  },
);

module.exports = RestfulController;
