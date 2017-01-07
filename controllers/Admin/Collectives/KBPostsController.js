/* global CONFIG, Class, Admin, Collective, RestfulController, KBPost, KBTopic */

const fs = require('fs-extra');

global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives || {};

const KBPostsController = Class(Admin.Collectives, 'KBPostsController')
.inherits(RestfulController)({
  beforeActions: [
    // collective
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
      actions: ['create', 'new'],
    },
    // load topics
    {
      before(req, res, next) {
        KBTopic.query()
          .then((result) => {
            req.topic = result;
            res.locals.topics = result;
            next();
          })
          .catch(next);
      },
      actions: ['create', 'new'],
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
        topicId: req.body.topic_id,
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

    destroy(req, res) {
      KBPost.query().where('id', req.params.id)
        .then(([found]) => found && found.destroy())
        .then(() => {
          res.status(200).end();
        });
    },
  },
});

module.exports = new KBPostsController();
