/* global Class, CONFIG, RestfulController, Event, EventAssistant */

const Campaigns = (global.Campaigns = global.Campaigns || {});

const EventsController = Class(Campaigns, 'EventsController').inherits(
  RestfulController,
)({
  beforeActions: [
    {
      before: '_loadEvent',
      actions: ['doRSVP', 'undoRSVP'],
    },
  ],

  _addRow(req, res, Model) {
    const userId = req.user.id;
    const eventId = req.params.id;

    Model.query()
      .where({ user_id: userId, event_id: eventId })
      .then(results => results.length || new Model({ userId, eventId }).save())
      .then(() => {
        res.redirect(
          CONFIG.router.helpers.Campaigns.show.url(req.event.campaignId),
        );
      });
  },

  prototype: {
    _loadEvent(req, res, next) {
      Event.query()
        .where({ id: req.params.id })
        .then(results => {
          req.event = results[0];
          next();
        })
        .catch(next);
    },

    doRSVP(req, res) {
      EventsController._addRow(req, res, EventAssistant);
    },

    undoRSVP(req, res) {
      EventAssistant.query()
        .where({ user_id: req.user.id, event_id: req.params.id })
        .then(results => results.length && results[0].destroy())
        .then(() => {
          res.redirect(
            CONFIG.router.helpers.Campaigns.show.url(req.event.campaignId),
          );
        });
    },
  },
});

module.exports = new EventsController();
