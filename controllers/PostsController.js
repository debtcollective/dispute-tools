/* global Class, CONFIG, RestfulController, NotFoundError, Post, PostsController */

const sanitize = require('sanitize-html');
const Promise = require('bluebird');

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
    create(req, res) {
      let builder = Promise.reject(new Error('Invalid post type'));

      if (req.type === 'Text') {
        builder = this._createTextPost(req, req.body.text);
      }

      if (req.type === 'Poll') {
        builder = this._createPollPost(req, req.body.options);
      }

      builder
        .then((post) => {
          res.json(post);
        })
        .catch((err) => {
          res.status = 400;

          res.json(err.errors || err);
        });
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

    _createTextPost(req, text) {
      const post = new Post();

      post.campaignId = req.params.campaignId;
      post.userId = req.user.id;

      text = sanitize(text, {
        allowedTags: [],
        allowedAttributes: [],
      });

      post.data = {
        text,
      };

      return post.save()
        .then(() => {
          return post;
        });
    },

    _createPollPost(req, options) {
      const post = new Post();

      post.campaignId = req.params.campaignId;
      post.userId = req.user.id;

      const sanitizedOptions = options.map((option) => {
        return sanitize(option, {
          allowedTags: [],
          allowedAttributes: [],
        });
      });

      post.data.options = sanitizedOptions;
      post.data.votes = sanitizedOptions.map((option) => {
        return [];
      });

      return post.save()
        .then(() => {
          return post;
        });
    },
  },
});

module.exports = new PostsController();
