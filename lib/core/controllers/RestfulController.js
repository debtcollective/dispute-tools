/* globals Class, BaseController */
/* eslint-disable no-unused-vars */

const RestfulController = Class('RestfulController').inherits('BaseController')({
  prototype: {
    name: null,

    init(config) {
      BaseController.prototype.init.call(this, config);

      return this;
    },

    index(req, res, next) {
      res.status(501).send('index Not Implemented');
    },

    show(req, res, next) {
      res.status(501).send('show Not Implemented');
    },

    edit(req, res, next) {
      res.status(501).send('edit Not Implemented');
    },

    new(req, res, next) {
      res.status(501).send('new Not Implemented');
    },

    create(req, res, next) {
      res.status(501).send('create Not Implemented');
    },

    update(req, res, next) {
      res.status(501).send('update Not Implemented');
    },

    destroy(req, res, next) {
      res.status(501).send('destroy Not Implemented');
    },
  },
});

module.exports = RestfulController;
