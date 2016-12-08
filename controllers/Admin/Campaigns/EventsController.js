/* global Class, CONFIG, RestfulController, NotFoundError,
Event, EventsController, neonode, Campaign, Account */

// const sanitize = require('sanitize-html');
// const Promise = require('bluebird');
// const fs = require('fs-extra');
const path = require('path');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));
const PAGE_SIZE = 50;

/* global Admin */
global.Admin = global.Admin || {};
global.Admin.Campaigns = global.Admin.Campaigns
  || Class(Admin, 'Campaign').inherits(Campaign)({
    resourceName: 'Admin.Campaigns',
  });

const EventsController = Class(Admin.Campaigns, 'EventsController').inherits(RestfulController)({
  beforeActions: [
    {
      before(req, res, next) {
        Campaign.query()
          .where('id', req.params.campaign_id)
          .then(([campaign]) => {
            req.campaign = campaign;
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        const query = Event.query()
          .where({
            campaign_id: req.params.campaign_id,
          })
          .include('[user.account]');

        RESTfulAPI.createMiddleware({
          queryBuilder: query,
          filters: {
            allowedFields: [],
          },
          order: {
            default: '-created_at',
            allowedFields: [
              'created_at',
            ],
          },
          paginate: {
            pageSize: PAGE_SIZE,
          },
        })(req, res, next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        req.events = res.locals.results || [];

        if (req._headers) {
          res.locals.headers = {
            total_count: parseInt(res._headers.total_count, 10),
            total_pages: parseInt(res._headers.total_pages, 10),
            current_page: parseInt(req.query.page || 1, 10),
            query: req.query,
          };
        }

        next();
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        Event.query()
          .where('id', req.params.id)
          .then((result) => {
            if (result.length === 0) {
              return next(new NotFoundError('Event not found'));
            }

            req.event = result[0];
            res.locals.event = result[0];

            return next();
          })
          .catch(next);
      },
      actions: ['update', 'delete'],
    },
  ],

  prototype: {
    index(req, res) {
      res.json(req.events);
    },

    create(req, res) {
      const event = new Event({
        campaignId: req.params.campaign_id,
        userId: req.user.id,
        date: req.body.date,
        name: req.body.name,
        title: req.body.title,
        map: req.body.map_url,
        description: req.body.description,
        locationName: req.body.location_name,
      });

      event.save()
        .then(() => res.json(event))
        .catch((err) => {
          res.status = 400;
          res.json(err.errors || { error: err });
        });
    },

    update(req, res) {
      req.event
        .updateAttributes({
          date: req.body.date,
          name: req.body.name,
          title: req.body.title,
          map: req.body.map_url,
          description: req.body.description,
          locationName: req.body.location_name,
        }).save()
        .then(() => res.json(req.event))
        .catch((err) => {
          res.status = 400;
          res.json(err.errors || { error: err });
        });
    },

    delete(req, res) {
      req.event.destroy()
        .then(() => {
          res.redirect(CONFIG.router.helpers.Campaigns.Events.url(req.params.campaign_id));
        });
    },
  },
});

module.exports = new EventsController();
