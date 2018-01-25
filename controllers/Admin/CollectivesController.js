/* globals neonode, CONFIG, Class, Admin, RestfulController, Collective, DisputeTool, User */

global.Admin = global.Admin || {};

const Promise = require('bluebird');
const fs = require('fs-extra');

Class(Admin, 'Collective').inherits(Collective)({
  resourceName: 'Admin.Collectives',
});

Admin.CollectivesController = Class(Admin, 'CollectivesController').inherits(
  RestfulController,
)({
  beforeActions: [
    // Authenticate first
    {
      before: [
        (req, res, next) =>
          neonode.controllers.Home._authenticate(req, res, next),
      ],
      actions: ['index', 'edit', 'update'],
    },
    // Load Collective
    {
      before: '_loadCollective',
      actions: ['edit', 'update'],
    },
    // Load Collectives
    {
      before(req, res, next) {
        Admin.Collective.queryVisible()
          .include('tools')
          .orderBy('created_at', 'DESC')
          .then(collectives => req.restifyACL(collectives))
          .then(collectives => {
            req.collectives = collectives;
            res.locals.collectives = collectives;
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
    // Load Dispute Tools
    {
      before(req, res, next) {
        DisputeTool.query()
          .orderBy('created_at', 'ASC')
          .then(tools => {
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
      Collective.queryVisible()
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
      let { disputeToolIds } = req.body;

      req.collective.updateAttributes(req.body);

      const knex = Collective.knex();

      Collective.transaction(trx =>
        req.collective
          .transacting(trx)
          .save()
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

            return Promise.each(disputeToolIds, id =>
              knex('CollectivesTools')
                .transacting(trx)
                .insert({
                  collective_id: req.collective.id,
                  tool_id: id,
                }),
            );
          })
          .then(() => {
            if (req.files && req.files.image && req.files.image.length > 0) {
              const image = req.files.image[0];

              return req.collective
                .attach('cover', image.path, {
                  fileSize: image.size,
                  mimeType: image.mimetype || image.mimeType,
                })
                .then(() => {
                  fs.unlinkSync(image.path);

                  return req.collective.transacting(trx).save();
                });
            }

            return Promise.resolve();
          })
          .then(trx.commit)
          .catch(trx.rollback),
      )
        .then(() => {
          req.flash('success', 'The collective has been updated.');
          res.redirect(CONFIG.router.helpers.Admin.Collectives.url());
        })
        .catch(next);
    },
  },
});

module.exports = new Admin.CollectivesController();
