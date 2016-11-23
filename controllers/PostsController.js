/* global Class, CONFIG, RestfulController, NotFoundError, Post, PostsController,
PostImage, neonode, Campaign */

const sanitize = require('sanitize-html');
const Promise = require('bluebird');
const fs = require('fs-extra');
const path = require('path');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

const PostsController = Class('PostsController').inherits(RestfulController)({
  beforeActions: [
    {
      before(req, res, next) {
        Campaign.query()
          .where('id', req.params.id)
          .then(([campaign]) => {
            req.campaign = campaign;
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        const query = Post.query()
          .where({
            campaign_id: req.params.id,
            parent_id: null,
          })
          .include('[comments, topic, user.account]');

        RESTfulAPI.createMiddleware({
          queryBuilder: query,
          filters: {
            allowedFields: [],
          },
          order: {
            default: '-created_at',
            allowedFields: [
              'created_at',
            ],
          },
          paginate: {
            pageSize: 50,
          },
        })(req, res, next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        req.posts = res.locals.results;

        res.locals.headers = {
          total_count: parseInt(res._headers.total_count, 10),
          total_pages: parseInt(res._headers.total_pages, 10),
          current_page: parseInt(req.query.page || 1, 10),
          query: req.query,
        };

        next();
      },
      actions: ['index'],
    },
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
      actions: ['update', 'delete'],
    },
  ],

  prototype: {
    index(req, res, next) {
      Promise.each(req.posts, (post) => {
        if (post.type !== 'Image') {
          return Promise.resolve();
        }

        return PostImage.query()
          .where({
            type: 'Post',
            foreign_key: post.id,
          })
          .then((result) => {
            if (result.length !== 0) {
              post.image = result[0];
            }

            return Promise.resolve();
          });
      })
      .then(() => {
        res.json(req.posts);
      })
      .catch(next);
    },

    create(req, res) {
      let builder = false;

      const controller = neonode.controllers.Posts;

      if (req.body.type === 'Text') {
        builder = controller._createTextPost(req, req.body.text);
      }

      if (req.body.type === 'Poll') {
        builder = controller._createPollPost(req);
      }

      if (req.body.type === 'Image') {
        builder = controller._createImagePost(req, req.body.text);
      }

      if (!builder) {
        builder = Promise.reject(new Error('Invalid post type'));
      }

      builder
        .then((post) => {
          res.json(post);
        })
        .catch((err) => {
          res.status = 400;

          res.json(err.errors || { error: err });
        });
    },

    _createTextPost(req, text) {
      const post = new Post({
        type: 'Text',
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
      });

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

    _createPollPost(req) {
      const post = new Post({
        type: 'Poll',
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
      });

      const sanitizedOptions = req.body.options.map((option) => {
        return sanitize(option, {
          allowedTags: [],
          allowedAttributes: [],
        });
      });

      post.data.title = sanitize(req.body.title, {
        allowedTags: [],
        allowedAttributes: [],
      });

      post.data.options = sanitizedOptions;
      post.data.votes = sanitizedOptions.map(() => {
        return [];
      });

      return post.save()
        .then(() => {
          return post;
        });
    },

    _createImagePost(req, text) {
      const post = new Post({
        type: 'Image',
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
      });

      text = sanitize(text, {
        allowedTags: [],
        allowedAttributes: [],
      });

      post.data = {
        text,
      };

      const attachment = new PostImage({
        type: 'Post',
      });

      return Post.transaction((trx) => {
        return post.transacting(trx).save()
          .then(() => {
            attachment.foreignKey = post.id;

            return attachment
              .transacting(trx)
              .save();
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then(() => {
        if (req.files && req.files.image && req.files.image.length > 0) {
          const image = req.files.image[0];

          return attachment.attach('file', image.path, {
            fileSize: image.size,
            mimeType: image.mimeType,
          })
          .then(() => {
            fs.unlinkSync(image.path);

            return attachment.save();
          });
        }

        return Promise.resolve();
      })
      .then(() => {
        post.data.image = attachment;

        return post;
      });
    },

    createComment(req, res) {
      const post = new Post({
        type: 'Text',
        parentId: req.body.parentId,
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
      });

      const text = sanitize(req.body.text, {
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

    update(req, res) {
      const post = req.post;

      const controller = neonode.controllers.Posts;

      let builder = false;

      if (post.type === 'Text') {
        builder = controller._updateTextPost(post, req.body.text);
      }

      if (post.type === 'Poll') {
        builder = controller._updatePollPost(req, post, req.body);
      }

      if (post.type === 'Image') {
        builder = controller._updateTextPost(post, req.body.text);
      }

      if (!builder) {
        builder = Promise.reject(new Error('Invalid post type'));
      }

      builder
        .then(res.json)
        .catch((err) => {
          res.status = 400;

          res.json(err.errors || { error: err });
        });
    },

    _updateTextPost(post, text) {
      post.data.text = sanitize(text, {
        allowedTags: [],
        allowedAttributes: [],
      });

      return post.save()
        .then(() => {
          return post;
        });
    },

    _updatePollPost(req, post, body) {
      if (body.title) {
        post.data.title = sanitize(body.title, {
          allowedTags: [],
          allowedAttributes: [],
        });
      }

      const index = body.index;

      let foundUser = false;

      for (let i = 0; i < post.votes.length; i++) {
        const currentItem = post.votes[i];

        for (let j = 0; j < currentItem.length; j++) {
          if (currentItem[j] === req.user.id) {
            foundUser = true;
            break;
          }
        }
      }

      if (!foundUser) {
        post.data.votes[index].push(req.user.id);

        return post.save()
          .then(() => {
            return post;
          });
      }

      return Promise.reject(new Error('You\'ve already voted in this poll'));
    },

    delete(req, res) {
      req.post.destroy()
        .then(() => {
          res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.campaignId));
        });
    },
  },
});

module.exports = new PostsController();
