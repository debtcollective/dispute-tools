/* global Class, CONFIG, RestfulController, EventAssistant */

const EventsController = Class('EventsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadEvent',
      actions: ['update', 'destroy'],
    },
  ],

  prototype: {
    _loadEvent(req, res, next) {
      const userId = req.user.id;
      const eventId = req.params.id;

      // find or create relationship
      EventAssistant.query()
        .where({ user_id: userId, event_id: eventId })
        .then((results) => {
          if (results.length === 0) {
            const a = new EventAssistant({
              user_id: userId,
              event_id: eventId,
            });

            a.save()
              .then(([id]) => {
                req.event = a;
                req.event.id = id;
                next();
              });
          } else {
            req.event = results[0];
            next();
          }
        });
    },

    update(req, res) {
      req.event.ignore = false;
      req.event.save().then(() => res.end('+RSVP'));
    },

    destroy(req, res) {
      req.event.ignore = true;
      req.event.save().then(() => res.end('+RSVP'));
    },
  },
});

module.exports = new EventsController();
