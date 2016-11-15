/* global Class, CONFIG, RestfulController, NotFoundError, Post, PostsController */

const PostsController = Class('PostsController').inherits(RestfulController)({
  beforeActions: [
    {
      before(req, res, next) {
        Post.query()
          .where('id', req.params.id)
          .then((result) => {
            if (result.length === 0) {
              return next(new NotFoundError('Post not found'));
            }

            req.post = result[0];
            res.locals.post = result[0];

            return next();
          })
          .catch(next);
      },
      actions: ['update'],
    },
  ],

  prototype: {
    create(req, res, next) {
      const post = new Post(req.body);

      post.userId = req.user.id;

      post.campaignId = req.params.campaignId;

      post.processAttachment(req.body)
        .then(() => {
          return post.save();
        })
        .then(() => {
          res.redirect(CONFIG.router.helpers.Campaigns.show.url(post.campaignId));
        })
        .catch(next);
    },

    update(req, res) {
      const post = req.post;

      post.data.text = req.body.text;

      post.save()
        .then(() => {
          res.json(post);
        })
        .catch((err) => {
          res.status = 400;
          res.json(err.errors || err);
        });
    },
  },
});

module.exports = new PostsController();
