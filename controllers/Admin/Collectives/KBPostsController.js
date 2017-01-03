/* global CONFIG, Class, Admin, Collective, RestfulController, KBPost */

const fs = require('fs-extra');

global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives || {};

const KBPostsController = Class(Admin.Collectives, 'KBPostsController')
.inherits(RestfulController)({
  beforeActions: [
    {
      before(req, res, next) {
        Collective.query()
          .where('id', req.params.collective_id)
          .then(([collective]) => {
            req.collective = collective;
            res.locals.collective = collective;
            next();
          })
          .catch(next);
      },
      actions: ['create', 'edit', 'new'],
    },
  ],

  prototype: {
    new(req, res) {
      res.render('admin/collectives/kbposts/new');
    },

    create(req, res) {
      const kbpost = new KBPost({
        name: req.body.name,
        data: {
          url: req.body.url,
        },
        collectiveId: req.params.collective_id,
      });

      kbpost.save()
        .then(() => {
          if (req.files && req.files.resource && req.files.resource.length > 0) {
            const resource = req.files.resource[0];

            return kbpost.attach('file', resource.path, {
              fileSize: resource.size,
              mimeType: resource.mimeType,
            })
            .then(() => {
              fs.unlinkSync(resource.path);

              return kbpost.save();
            });
          }

          return Promise.resolve();
        })
        .then(() => {
          req.flash('success', 'The resource has been created.');
          res.redirect(
            `${CONFIG.router.helpers.Collectives.show.url(req.params.collective_id)}#resources`
          );
        })
        .catch((err) => {
          res.status(400);

          res.locals.errors = err.errors || err;

          res.render('admin/collectives/kbposts/new');
        });
    },
  },
});

module.exports = new KBPostsController();
