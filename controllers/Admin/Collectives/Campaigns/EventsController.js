/* global Class, CONFIG, RestfulController, NotFoundError,
Event, EventsController, neonode, Campaign, Account
EventAssistant */

// const sanitize = require('sanitize-html');
// const Promise = require('bluebird');
// const fs = require('fs-extra');
const path = require('path');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));
const PAGE_SIZE = 50;

/* global Admin */
global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives || {};
global.Admin.Collectives.Campaigns = global.Admin.Collectives.Campaigns || {};

const EventsController = Class(
  Admin.Collectives.Campaigns,
  'EventsController',
).inherits(RestfulController)({
  beforeActions: [
    {
      before(req, res, next) {
        Campaign.query()
          .where('id', req.params.campaign_id)
          .include('collective')
          .then(([campaign]) => {
            req.campaign = campaign;
            res.locals.campaign = campaign;
            next();
          })
          .catch(next);
      },
      actions: ['index', 'new', 'edit', 'update'],
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
            allowedFields: ['created_at'],
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
          .then(result => {
            if (result.length === 0) {
              return next(new NotFoundError('Event not found'));
            }

            req.event = result[0];
            res.locals.event = result[0];

            return next();
          })
          .catch(next);
      },
      actions: ['edit', 'update', 'delete'],
    },
    {
      before(req, res, next) {
        EventAssistant.query()
          .include('[user.account]')
          .where('event_id', req.params.id)
          .then(results => {
            res.locals.attendees = results;
            next();
          })
          .catch(next);
      },
      actions: ['show'],
    },
  ],

  prototype: {
    index(req, res) {
      res.json(req.events);
    },

    new(req, res) {
      res.render('admin/campaigns/events/new');
    },

    show(req, res) {
      res.render('admin/campaigns/events/show');
    },

    edit(req, res) {
      res.render('admin/campaigns/events/edit');
    },

    create(req, res) {
      const event = new Event({
        campaignId: req.params.campaign_id,
        userId: req.user.id,
        date: new Date(req.body.date),
        timespan: req.body.timespan,
        name: req.body.name,
        description: req.body.description,
        locationName: req.body.location,
      });

      event
        .save()
        .then(() => {
          req.flash('success', 'The event has been created.');
          res.redirect(
            CONFIG.router.helpers.Campaigns.show.url(req.params.campaign_id),
          );
        })
        .catch(err => {
          res.status(400);
          res.locals.errors = err.errors || err;
          res.render('admin/campaigns/events/new');
        });
    },

    update(req, res) {
      req.body.locationName = req.body.location;
      req.body.date = new Date(req.body.date);
      req.event
        .updateAttributes(req.body)
        .save()
        .then(() => {
          req.flash('success', 'The event has been updated.');
          res.redirect(
            CONFIG.router.helpers.Campaigns.show.url(req.params.campaign_id),
          );
        })
        .catch(err => {
          res.status = 400;
          res.locals.errors = err.errors || err;
          res.render('admin/campaigns/events/edit');
        });
    },

    delete(req, res) {
      req.event.destroy().then(() => {
        res.redirect(
          CONFIG.router.helpers.Campaigns.Events.url(req.params.campaign_id),
        );
      });
    },
  },
});

module.exports = new EventsController();
