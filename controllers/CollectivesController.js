/* globals CONFIG, Class, RestfulController, Collective, DisputeTool, User, Campaign, Account */

const marked = require('marked');
const Promise = require('bluebird');

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
    // Load Collective
    {
      before: '_loadCollective',
      actions: [
        'show',
        'join',
      ],
    },
  ],
  prototype: {
    _loadCollective(req, res, next) {
      Collective.query()
        .where({ id: req.params.id })
        .include('[tools, users.[account]]')
        .then(([collective]) => {
          collective.tools.forEach(tool => {
            tool.about = marked(tool.about);
          });

          if (collective.manifest) {
            collective.manifest = marked(collective.manifest);
          }

          return collective;
        })
        .then((collective) => {
          const query = Campaign.query();

          query.where({
            collective_id: req.params.id,
            published: true,
          });

          if (req.user.role === 'Admin' ||
          (req.user.role === 'CampaignManager' && req.canCreateCampaigns)) {
            query.andWhere({
              published: false,
            });
          }

          query.then((campaigns) => {
            collective.campaigns = campaigns;

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

      Collective.query()
        .transaction((trx) => {
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
