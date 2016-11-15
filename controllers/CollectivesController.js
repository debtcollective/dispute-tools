/* globals CONFIG, Class, RestfulController, Collective, DisputeTool, User */
const marked = require('marked');
const Promise = require('bluebird');

const CollectivesController = Class('CollectivesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCollective',
      actions: [
        'show',
        'join',
      ],
    },
    {
      before(req, res, next) {
        Collective.query()
          .include('[tools, users, campaigns]')
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
  ],
  prototype: {
    _loadCollective(req, res, next) {
      Collective.query()
        .where({ id: req.params.id })
        .include('[tools, users.[account], campaigns]')
        .then(([collective]) => {
          collective.tools.forEach(tool => {
            tool.about = marked(tool.about);
          });

          if (collective.manifest) {
            collective.manifest = marked(collective.manifest);
          }

          res.locals.collective = collective;
          req.collective = collective;

          next();
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
