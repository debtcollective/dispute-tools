/* global Class, CONFIG, RestfulController, EventAssistant */

const Campaigns = global.Campaigns = global.Campaigns || {};
const EventsController = Class(Campaigns, 'EventsController').inherits(RestfulController)({
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
            const a = new EventAssistant({ userId, eventId });

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
      req.event.save().then(() => {
        res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.campaign_id));
      });
    },

    destroy(req, res, next) {
      if (req.body._destroy) {
        req.event.destroy()
          .then(() => {
            res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.campaign_id));
            next();
          })
          .catch(next);
        return;
      }

      req.event.ignore = true;
      req.event.save().then(() => {
        res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.campaign_id));
      });
    },
  },
});

module.exports = new EventsController();
