/* global Class, CONFIG, RestfulController, Campaign, NotFoundError, Account, Topic,
User, Event, EventAssistant, KBTopic, KBPost */

const path = require('path');
const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

const marked = require('marked');
const Promise = require('bluebird');

const CampaignsController = Class('CampaignsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCampaign',
      actions: ['show', 'join'],
    },
    // Sum totalDebtAmount for Campaign
    {
      before(req, res, next) {
        res.locals.totalDebtAmount = 0;

        return Campaign.knex()
          .select('debt_amount')
          .from('UsersCampaigns')
          .where('campaign_id', req.params.id)
          .then(results => {
            const total = results.reduce((p, c) =>
              ({ debt_amount: (p.debt_amount + c.debt_amount) }), { debt_amount: 0 });

            res.locals.totalDebtAmount = total.debt_amount || 0;

            return next();
          })
          .catch(next);
      },
      actions: ['show'],
    },
    {
      before: '_getFiles',
      actions: ['show'],
    },
    {
      before: '_decorateFiles',
      actions: ['show'],
    },
    // load kb-topics
    {
      before(req, res, next) {
        KBTopic.query().then((results) => {
          req.kbTopics = results;
          res.locals.kbTopics = results;
          next();
        });
      },
      actions: ['show'],
    },
    // check if user can create events
    {
      before(req, res, next) {
        req.canCreateEvents = false;
        res.locals.canCreateEvents = false;

        if (!req.user) {
          return next();
        }

        if (req.user.role === 'Admin') {
          req.canCreateEvents = true;
          res.locals.canCreateEvents = true;

          return next();
        }

        return User.knex()
          .table('CollectiveAdmins')
          .where({
            collective_id: req.campaign.collective.id,
            user_id: req.user.id,
          })
          .then(results => {
            if (results.length !== 0) {
              req.canCreateEvents = true;
              res.locals.canCreateEvents = true;
            }

            return next();
          })
          .catch(next);
      },
      actions: ['show'],
    },
    // check if user can create kb-posts
    {
      before(req, res, next) {
        req.canCreateKBPosts = false;
        res.locals.canCreateKBPosts = false;

        if (!req.user) {
          return next();
        }

        if (req.user.role === 'Admin') {
          req.canCreateKBPosts = true;
          res.locals.canCreateKBPosts = true;

          return next();
        }

        return User.knex()
          .table('CollectiveAdmins')
          .where({
            collective_id: req.campaign.collective.id,
            user_id: req.user.id,
          })
          .then(results => {
            if (results.length !== 0) {
              req.canCreateKBPosts = true;
              res.locals.canCreateKBPosts = true;
            }

            return next();
          })
          .catch(next);
      },
      actions: ['show'],
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
    _getFiles(req, res, next) {
      const query = KBPost.query();

      Promise.coroutine(function* restfulapi() {
        if (req.query.search) {
          query.whereIn('id', yield KBPost.search(req.query.search));
        }

        if (req.query.topicId) {
          query.where('topic_id', req.query.topicId);
        }

        query.where('campaign_id', req.params.id);
      })()
      .then(() => {
        RESTfulAPI.createMiddleware({
          queryBuilder: query,
          order: {
            default: '-created_at',
            allowedFields: [
              'created_at',
              'updated_at',
            ],
          },
          paginate: {
            pageSize: 50,
          },
        })(req, res, next);
      })
      .catch(next);
    },

    _decorateFiles(req, res, next) {
      // attach topic
      res.locals.campaign.kbPosts = res.locals.results;
      req.campaign.kbPosts = res.locals.results;

      delete res.locals.results;

      return Promise.all(req.campaign.kbPosts.map((kb) => {
        return KBTopic.query().where({ id: kb.topicId })
          .then(([topic]) => {
            // decorate for views
            if (kb.file && kb.fileMeta) {
              kb.fixedExt = kb.fileMeta.original.format || kb.fileMeta.original.ext.toUpperCase();
              kb.fixedWeight = `${kb.fileMeta.original.size / 1000}KB`;

              kb.isImage = ['JPG', 'JPEG', 'PNG'].indexOf(kb.fileMeta.original.format) > -1;
            }

            kb.fixedURL = kb.data.url && kb.data.url.indexOf('://') === -1 ? `http://${kb.data.url}` : kb.data.url;
            kb.shortURL = kb.fixedURL && kb.fixedURL.match(/:\/\/([^/]+)/)[1];

            kb.isVideo = !!(kb.data.url && kb.data.url.match(/youtube|vimeo|mp4|ogv|webm|flv/));
            kb.isAudio = !!(kb.data.url && kb.data.url.match(/mp3|wav|ogg/));

            kb.topic = topic.title;

            // Type class name
            if (kb.isAudio) kb.type = 'audio';
            if (kb.isVideo) kb.type = 'video';
            if (kb.isImage) kb.type = 'image';
            if (kb.isFile) kb.type = 'file';
          });
      })).then(() => next()).catch(next);
    },

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

                    // mark events if I am attendee
                    events[i].imAttendee = req.user && users
                      .filter(a => a.userId === req.user.id).length > 0;
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
      const debtAmount = (req.body.debt_amount * 100) || 0;

      Campaign.transaction((trx) => {
        knex.table('UsersCampaigns')
          .transacting(trx)
          .insert({
            user_id: req.user.id,
            campaign_id: req.params.id,
            debt_amount: debtAmount,
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
