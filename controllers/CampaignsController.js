/* global Class, CONFIG, RestfulController, Campaign, NotFoundError, Account, Topic,
User, Event, EventAssistant */
const marked = require('marked');
const Promise = require('bluebird');

const CampaignsController = Class('CampaignsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCampaign',
      actions: ['show', 'join'],
    },
    {
      before(req, res, next) {
        const knex = Campaign.knex();

        req.userBelongsToCampaign = false;
        res.locals.userBelongsToCampaign = false;

        if (!req.user) {
          return next();
        }

        return knex.table('UsersCampaigns')
          .where({
            user_id: req.user.id,
            campaign_id: req.params.id,
          })
          .then((result) => {
            if (result.length > 0) {
              req.userBelongsToCampaign = true;
              res.locals.userBelongsToCampaign = true;
            }

            return next();
          })
          .catch(next);
      },
      actions: ['show'],
    },
    // Attach accounts to users
    {
      before(req, res, next) {
        return Promise.each(req.campaign.users, (user) => {
          return Account.query()
            .where('user_id', user.id)
            .then(([account]) => {
              user.account = account;
            });
        })
        .then(() => {
          next();
        })
        .catch(next);
      },
      actions: ['show'],
    },
    // Load topics
    {
      before(req, res, next) {
        Topic.query()
          .then((result) => {
            req.topics = result;
            res.locals.topics = result;

            next();
          });
      },
      actions: ['show'],
    },

  ],

  prototype: {
    _loadCampaign(req, res, next) {
      Campaign.query()
        .where('id', req.params.id)
        .include('[collective, posts, users]')
        .then((campaign) => {
          if (campaign.length === 0) {
            return next(new NotFoundError('Campaign not found.'));
          }

          if (campaign[0].description) {
            campaign[0].description = marked(campaign[0].description);
          }

          req.campaign = campaign[0];
          res.locals.campaign = campaign[0];

          // load related events
          return Event.query()
            .include('[user.account]')
            .where('campaign_id', req.params.id)
            .where('date', '>=', new Date().toISOString().slice(0, 10))
            // mark events according
            .then((events) =>
              Promise.all(events
                // retrieve all attendees from all events
                .map(e => EventAssistant.query()
                  .include('[user.account]')
                  .where('event_id', e.id)
                ))
                .then((attendees) => {
                  attendees.forEach((users, i) => {
                    events[i].attendees = users;
                  });

                  res.locals.event = events.shift();
                  res.locals.nextEvents = events;

                  next();
                }));
        })
        .catch(next);
    },

    show(req, res) {
      res.render('campaigns/show');
    },

    join(req, res, next) {
      const knex = Campaign.knex();

      Campaign.transaction((trx) => {
        knex.table('UsersCampaigns')
          .transacting(trx)
          .insert({
            user_id: req.user.id,
            campaign_id: req.params.id,
          })
          .then(() => {
            req.campaign.userCount++;

            return req.campaign
              .transacting(trx)
              .save();
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then(() => {
        req.flash('success', `You have successfully joined to ${req.campaign.title}`);
        res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.id));
      })
      .catch(next);
    },
  },
});

module.exports = new CampaignsController();
