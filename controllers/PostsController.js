/* global Class, CONFIG, RestfulController, NotFoundError, Post, PostsController,
PostImage, neonode, Campaign, Account */

const _ = require('lodash');
const sanitize = require('sanitize-html');
const Promise = require('bluebird');
const fs = require('fs-extra');
const path = require('path');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));
const PAGE_SIZE = 15;

const PostsController = Class('PostsController').inherits(RestfulController)({
  beforeActions: [{
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

      const knex = Post.knex();

      const restifyPosts = (onlyPublic) => {
          // if not, display only public posts
        if (onlyPublic) {
          query.where('public', true);
        }

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
            pageSize: PAGE_SIZE,
          },
        })(req, res, next);
      };

        // only public posts
      if (!req.user) {
        restifyPosts(true);
        return;
      }

        // the user belongs to the campaign?
      knex('UsersCampaigns')
          .where({
            user_id: req.user.id,
            campaign_id: req.params.id,
          })
          .then(result => restifyPosts(!result.length)).catch(next);
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
    // add user account to comments
  {
    before(req, res, next) {
      function getAccount(comment) {
        return Account.query()
            .where('user_id', comment.userId)
            .then(([account]) => {
              comment.user = comment.user || {};
              comment.user.account = account;
            });
      }

      Promise.all(function* getCommentsAccount() {
        for (const post of req.posts) {
          for (const comment of post.comments) {
            yield getAccount(comment);
          }
        }
      }()).then(() => next()).catch(next);
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
    actions: ['update', 'delete', 'votePoll'],
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

                if (post.image.file.exists('thumb')) {
                  post.imageURL = post.image.file.url('thumb');
                }
              }

              return Promise.resolve();
            });
      })
        .then(() => {
          const posts = req.posts;

          // Filter user private fields
          // This needs to be added to the ORM itself
          _.forEach(posts, (post) => {
            post.user = _.pick(post.user, ['id', 'role', 'account']);
          });

          res.json(posts);
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

          res.json(err.errors || {
            error: err,
          });
        });
    },

    _createTextPost(req, text) {
      const post = new Post({
        type: 'Text',
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
        public: req.body.public,
      });

      text = sanitize(text, {
        allowedTags: [],
        allowedAttributes: [],
      });

      post.data = {
        text,
      };

      return post.save()
        .then(() => post);
    },

    _createPollPost(req) {
      const post = new Post({
        type: 'Poll',
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
        public: req.body.public,
      });

      const sanitizedOptions = req.body.options.map((option) =>
        sanitize(option, {
          allowedTags: [],
          allowedAttributes: [],
        })
      );

      post.data.title = sanitize(req.body.title, {
        allowedTags: [],
        allowedAttributes: [],
      });

      post.data.options = sanitizedOptions;
      post.data.votes = sanitizedOptions.map(() => []);

      return post.save()
        .then(() => post);
    },

    _createImagePost(req, text) {
      const post = new Post({
        type: 'Image',
        campaignId: req.params.id,
        userId: req.user.id,
        topicId: req.body.topicId,
        public: req.body.public,
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

      return Post.transaction((trx) =>
          post.transacting(trx).save()
          .then(() => {
            attachment.foreignKey = post.id;

            return attachment
              .transacting(trx)
              .save();
          })
          .then(trx.commit)
          .catch(trx.rollback)
        )
        .then(() => {
          if (req.files && req.files.image && req.files.image.length > 0) {
            const image = req.files.image[0];

            return attachment.attach('file', image.path, {
              fileSize: image.size,
              mimeType: image.mimetype || image.mimeType,
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
          res.json(post);
        })
        .catch(err => {
          res.status = 400;

          res.json(err.errors || {
            error: err,
          });
        });
    },

    votePoll(req, res) {
      const index = req.body.index;
      const post = req.post;

      let foundUser = false;

      for (let i = 0; i < post.data.votes.length; i++) {
        const currentItem = post.data.votes[i];

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
            res.json(post);
          })
          .catch((err) => {
            res.status = 400;

            res.json(err.errors || {
              error: err,
            });
          });
      }

      return Promise.reject(new Error('You\'ve already voted in this poll'));
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
        .then(() => {
          res.json(post);
        })
        .catch((err) => {
          res.status = 400;

          res.json(err.errors || {
            error: err,
          });
        });
    },

    _updateTextPost(post, text) {
      post.data.text = sanitize(text, {
        allowedTags: [],
        allowedAttributes: [],
      });

      return post.save()
        .then(() => post);
    },

    _updatePollPost(req, post, body) {
      post.data.title = sanitize(body.title, {
        allowedTags: [],
        allowedAttributes: [],
      });

      return post.save()
        .then(() => post);
    },

    delete(req, res) {
      req.post.destroy()
        .then(() => {
          res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.campaign_id));
        });
    },
  },
});

module.exports = new PostsController();
