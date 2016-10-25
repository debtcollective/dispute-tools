/* globals CONFIG, Class, Admin, RestfulController, Collective, DisputeTool, */

global.Admin = global.Admin || {};

const Promise = require('bluebird');

Admin.CollectivesController = Class(Admin, 'CollectivesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCollective',
      actions: [
        'edit',
        'update',
      ],
    },
    {
      before(req, res, next) {
        Collective.query()
          .include('tools')
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
        DisputeTool.query()
          .orderBy('created_at', 'ASC')
          .then((tools) => {
            req.disputeTools = tools;
            res.locals.disputeTools = tools;
            next();
          })
          .catch(next);
      },
      actions: ['index', 'edit'],
    },
  ],
  prototype: {
    _loadCollective(req, res, next) {
      Collective.query()
        .where({ id: req.params.id })
        .include('tools')
        .then(([collective]) => {
          res.locals.collective = collective;
          req.collective = collective;

          next();
        })
        .catch(next);
    },

    index(req, res) {
      res.render('admin/collectives/index');
    },

    edit(req, res) {
      res.render('admin/collectives/edit');
    },

    update(req, res, next) {
      const {
        name,
        description,
        manifest,
      } = req.body;

      let {
        disputeToolIds,
      } = req.body;

      req.collective.updateAttributes({
        name,
        description,
        manifest,
      });

      const knex = Collective.knex();

      Collective.transaction((trx) => {
        return req.collective.transacting(trx).save()
          .then(() => {
            if (!disputeToolIds) {
              return Promise.resolve();
            }

            return knex('CollectivesTools')
              .transacting(trx)
              .where('collective_id', req.collective.id)
              .del();
          })
          .then(() => {
            if (!disputeToolIds) {
              return Promise.resolve();
            }

            if (!Array.isArray(disputeToolIds)) {
              disputeToolIds = [disputeToolIds];
            }

            return Promise.each(disputeToolIds, (id) => {
              return knex('CollectivesTools')
                .transacting(trx)
                .insert({
                  collective_id: req.collective.id,
                  tool_id: id,
                });
            });
          });
      })
      .then(() => {
        req.flash('success', 'The collective has been updated.');
        res.redirect(CONFIG.router.helpers.Admin.Collectives.url());
      })
      .catch(next);
    },
  },
});

module.exports = new Admin.CollectivesController();
