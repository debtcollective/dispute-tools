/* globals CONFIG, Class, RestfulController, Collective, DisputeTool, User, Campaign, Account, CollectiveBans,
Topic */

const marked = require('marked');
const Promise = require('bluebird');

// TODO: attach kbposts to any collective listed

const CollectivesController = Class('CollectivesController').inherits(RestfulController)({
  beforeActions: [
    // Load Collectives
  {
    before(req, res, next) {
      Collective.query()
        .include('[tools, users]')
        .orderBy('created_at', 'DESC')
        .then((collectives) => {
          req.collectives = collectives;
          res.locals.collectives = collectives;
          next();
        })
      .catch(next);
    },
    actions: ['index'],
  },
  // Load Collective
  {
    before: '_loadCollective',
    actions: [
      'show',
      'join',
    ],
  },
  // Check if user can create campaigns
  {
    before(req, res, next) {
      req.canCreateCampaigns = false;
      res.locals.canCreateCampaigns = false;

      if (!req.user) {
        return next();
      }

      return User.knex()
        .table('CollectiveAdmins')
        .where({
          collective_id: req.params.id,
          user_id: req.user.id,
        })
      .then((results) => {
        if (results.length !== 0) {
          req.canCreateCampaigns = true;
          res.locals.canCreateCampaigns = true;
        }

        return next();
      })
      .catch(next);
    },
    actions: ['show'],
  },
  // Check if user belongs to collective
  {
    before(req, res, next) {
      res.locals.belongsToCollective = false;

      if (!req.user) {
        return next();
      }

      return User.knex().table('UsersCollectives')
        .where({
          user_id: req.user.id,
          collective_id: req.params.id,
        })
      .then(result => {
        if (result.length > 0) {
          res.locals.belongsToCollective = true;
        }
        next();
      });
    },
    actions: ['show'],
  },
  //Check if user is banned
  {
    before(req, res, next) {
      if (!req.user) {
        return next();
      }

      return CollectiveBans.query()
        .where({
          user_id: req.user.id,
          collective_id: req.params.id,
        })
      .then((result) => {
        if (result.length > 0) {
          req.flash('warning', 'You are banned from this collective.');
          res.redirect(CONFIG.router.helpers.Collectives.url());
        } else {
          next();
        }
      });
    },
    actions: ['show']
  },
  // Attach accounts to users
  {
    before(req, res, next) {
      return Promise.each(req.collective.users, (user) => {
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
  // Check if user belongs to campaigns
  {
    before(req, res, next) {
      if (!req.user) {
        return next();
      }

      const knex = Campaign.knex();

      return Promise.each(req.collective.campaigns, (campaign) => {
        return knex.table('UsersCampaigns')
          .where({
            user_id: req.user.id,
            campaign_id: campaign.id,
          })
        .then((results) => {
          campaign.userBelongsToCampaign = false;

          if (results.length > 0) {
            campaign.userBelongsToCampaign = true;
          }

          return Promise.resolve();
        });
      })
      .then(() => {
        return next();
      })
      .catch(next);
    },
    actions: ['show'],
  },
  // Check if user belongs to collectives
  {
    before(req, res, next) {
      if (!req.user) {
        return next();
      }

      const knex = Collective.knex();

      return Promise.each(req.collectives, (collective) => {
        return CollectiveBans.query()
          .where({
            collective_id: collective.id,
            user_id: req.user.id,
          }).then((results) => {
            collective.userBelongsToCollective = false;
            collective.userIsBannedFromCollective = results.length > 0;

            return collective.userIsBannedFromCollective || knex.table('UsersCollectives')
              .where({
                user_id: req.user.id,
                collective_id: collective.id,
              })
            .then((_results) => {
              collective.userBelongsToCollective = false;

              if (_results.length > 0) {
                collective.userBelongsToCollective = true;
              }
            });
          });
      })
      .then(() => {
        return next();
      })
      .catch(next);
    },
    actions: ['index'],
  },

  ],
  prototype: {
    _loadCollective(req, res, next) {
      Collective.query()
        .where({ id: req.params.id })
        .include('[kbPosts, tools, users.[account]]')
        .then(([collective]) => {
          collective.tools.forEach(tool => {
            tool.about = marked(tool.about);
          });

          if (collective.manifest) {
            collective.manifest = marked(collective.manifest);
          }

          return collective;
        })
      // attach topic
      .then((collective) => {
        return Promise.all(collective.kbPosts.map((kb) => {
          return Topic.query().where({ id: kb.topicId })
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
            });
        })).then(() => collective);
      })
      .then((collective) => {
        const query = Campaign.query();

        query.where({
          collective_id: req.params.id,
          published: true,
        });

        if ((req.user && (req.user.role === 'Admin')) ||
            (req.user && (req.user.role === 'CampaignManager') && req.canCreateCampaigns)) {
          query.orWhere({
            collective_id: req.params.id,
            published: false,
          });
        }

        query.then((campaigns) => {
          collective.campaigns = campaigns;

          collective.campaigns.forEach(campaign => {
            if (campaign.description) {
              campaign.description = marked(`${campaign.description.substring(0, 100)}...`);
            }
          });

          res.locals.collective = collective;
          req.collective = collective;
          return next();
        })
        .catch(next);
      })
      .catch(next);
    },

    index(req, res) {
      res.render('collectives/index');
    },

    show(req, res) {
      res.render('collectives/show');
    },

    join(req, res, next) {
      const knex = User.knex();

      Collective.transaction((trx) => {
        return knex
          .table('UsersCollectives')
          .transacting(trx)
          .insert({
            user_id: req.user.id,
            collective_id: req.collective.id,
          })
        .then(() => {
          req.collective.userCount++;

          return req.collective
            .transacting(trx)
            .save();
        })
        .then(trx.commit)
          .catch(trx.rollback);
      })
      .then(() => {
        req.flash('success', `You have successfully joined ${req.collective.name}`);
        res.redirect(CONFIG.router.helpers.Collectives.show.url(req.params.id));
      })
      .catch(next);
    },
  },
});

module.exports = new CollectivesController();
