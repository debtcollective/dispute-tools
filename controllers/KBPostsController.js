/* global Class, CONFIG, RestfulController, NotFoundError, KBPost, KBPostsController,
KBPostFile, neonode, Campaign, Account */

const sanitize = require('sanitize-html');
const Promise = require('bluebird');
const fs = require('fs-extra');
const path = require('path');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));
const PAGE_SIZE = 50;

const KBPostsController = Class('KBPostsController').inherits(RestfulController)({
  beforeActions: [
    // Load Collectives
  {
    before(req, res, next) {
      KBPost.query()
        .orderBy('created_at', 'DESC')
        .then((kBPosts) => {
          req.kBPosts = kBPosts;
          res.locals.kBPosts = kBPosts;
          next();
        })
      .catch(next);
    },
    actions: ['index'],
  },
  // Load Collective
  {
    before: '_loadKBPost',
    actions: [
      'show',
      'join',
    ],
  },
  // Check if user can create KBPosts
  {
    before(req, res, next) {
      req.canCreateKBPosts = false;
      res.locals.canCreateKBPostss = false;

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
  ],
  prototype: {
    _loadKBPost(req, res, next) {
      KBPost.query()
        .where({ id: req.params.id })
        .include('[users.[account]]')
        .catch(next);
    },

    index(req, res) {
      res.render('kBPosts/index');
    },

    show(req, res) {
      res.render('kBPosts/show');
    },
  },
});

module.exports = new KBPostsController();
