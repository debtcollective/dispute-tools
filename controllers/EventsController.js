/* global Class, CONFIG, RestfulController, EventAssistant */

const uuid = require('uuid');

const EventsController = Class('EventsController').inherits(RestfulController)({
  prototype: {
    update(req, res) {
      res.end('RSVP');
    },

    destroy(req, res) {
      res.end('delete or ignore?');
    },
  },
});

module.exports = new EventsController();
