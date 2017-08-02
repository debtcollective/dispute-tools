/* globals Admin, Class, RestfulController, User, NotFoundError,
CONFIG, Collective, Account, DisputeTool, neonode */

const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

global.Admin = global.Admin || {};

Admin.UsersController = Class(Admin, 'UsersController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [
        (req, res, next) => {
          return neonode.controllers.Home._authenticate(req, res, next);
        },
      ],
      actions: ['index', 'edit', 'update'],
    },
    {
      before: '_loadUser',
      actions: ['edit', 'update'],
    },
    {
      before(req, res, next) {
        const query = User.query();

        Promise.coroutine(function* restfulapi() {
          const userIds = yield User.search(req.query);

          if (req.query.search || req.query.state) {
            query.whereIn('id', userIds);
          }
        })()
        .then(() => {
          RESTfulAPI.createMiddleware({
            queryBuilder: query
              .include('[account, debtTypes]'),
            filters: {
              allowedFields: [
                'role',
              ],
            },
            order: {
              default: '-created_at',
              allowedFields: [
                'created_at',
                'updated_at',
              ],
            },
            paginate: {
              pageSize: 50,
            },
          })(req, res, next);
        })
        .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        res.locals.users = res.locals.results;

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
        // fixed redirection
        if (req.query._backUrl) {
          res.locals._backUrl = req.query._backUrl;
        }

        Collective.query()
          .orderBy('created_at', 'ASC')
          .then((collectives) => {
            req.collectives = collectives;
            res.locals.collectives = collectives;
            next();
          })
          .catch(next);
      },
      actions: [
        'edit',
        'update',
      ],
    },
  ],

  prototype: {
    _loadUser(req, res, next) {
      const query = User.query()
        .include('[account, debtTypes, collectiveAdmins]')
        .where('id', req.params.id);

      query
        .then((result) => {
          if (result.length === 0) {
            return next(new NotFoundError(`User ${req.params.id}  not found)`));
          }

          req.user = result[0];
          res.locals.user = result[0];
          return next();
        })
        .catch(next);
    },

    index(req, res) {
      res.render('admin/users/index');
    },

    edit(req, res) {
      res.render('admin/users/edit');
    },

    update(req, res) {
      const user = res.locals.user;

      user.updateAttributes(req.body);
      user.account.updateAttributes(req.body);

      const knex = User.knex();

      if (!Array.isArray(req.body.collectiveIds)) {
        req.body.collectiveIds = [req.body.collectiveIds];
      }

      const usersCollectives = req.body.collectiveIds.map((id) => {
        return {
          user_id: user.id,
          collective_id: id,
        };
      });

      User.transaction((trx) => {
        return user.transacting(trx).save()
          .then(() => {
            if (req.files && req.files.image && req.files.image.length > 0) {
              const image = req.files.image[0];

              return user.account.attach('image', image.path, {
                fileSize: image.size,
                mimeType: image.mimetype || image.mimeType
              })
              .then(() => {
                fs.unlinkSync(image.path);

                return user.account.transacting(trx).save();
              });
            }

            return user.account.transacting(trx).save();
          })
          .then(() => {
            return knex('CollectiveAdmins')
              .transacting(trx)
              .where({
                user_id: user.id,
              })
              .del();
          })
          .then(() => {
            if (user.role !== 'CollectiveManager') {
              return Promise.resolve();
            }

            return knex('CollectiveAdmins')
              .transacting(trx)
              .insert(usersCollectives);
          })
          .then(() => {
            // Get collectiveIds where the users has not already joined
            return Promise.map(req.body.collectiveIds, (collectiveId) => {
              return User.knex()
                .table('UsersCollectives')
                .where({
                  user_id: user.id,
                  collective_id: collectiveId,
                }).then((result) => {
                  if (result.length === 0) {
                    return collectiveId;
                  }
                });
            })
            .then((collectiveIds) => {
              collectiveIds = collectiveIds.filter(n => {
                return n !== undefined;
              });

              // Sum newly joined collective's user count
              return Promise.each(collectiveIds, (collectiveId) => {
                return Collective.query()
                  .where('id', collectiveId)
                  .then(([collective]) => {
                    collective.userCount++;

                    return collective.save();
                  });
              });
            });
          })
          .then(() => {
            if (user.role !== 'CollectiveManager') {
              return Promise.resolve();
            }

            return Promise.each(usersCollectives, (uc) => {
              return knex('UsersCollectives')
                .where(uc)
                .then((result) => {
                  if (result.length !== 0) {
                    return Promise.resolve();
                  }

                  return knex('UsersCollectives')
                    .transacting(trx)
                    .insert(uc);
                });
            });
          })
          .finally(trx.commit)
          .catch(trx.rollback);
      })
      .then(() => {
        user.activationToken = null;

        return user.save();
      })
      .then(() => {
        req.flash('success', 'Profile updated succesfully');

        let redirect = CONFIG.router.helpers.Admin.Users.url();

        if (user.id === req.user.id && user.role !== 'Admin') {
          redirect = CONFIG.router.helpers.Users.show.url(user.id);
        }

        return res.redirect(req.body._backUrl || redirect);
      })
      .catch((err) => {
        res.status(400);

        res.locals.errors = err.errors || err;

        res.render('admin/users/edit.pug');
      });
    },

    ban(req, res) {
      if (req.user.id === req.params.id) {
        req.flash('error', 'Cannot ban yourself!');
        res.redirect(req.body._backUrl || CONFIG.router.helpers.Admin.Users.url());
        return;
      }

      User.query().where({ id: req.params.id })
      .then(([firstUser]) => {
        firstUser.banned = true;
        return firstUser.save();
      })
      .then(() => {
        req.flash('success', 'User banned succesfully');
        res.redirect(req.body._backUrl || CONFIG.router.helpers.Admin.Users.url());
      })
      .catch((error) => {
        req.flash('error', `An error was occurred: ${error.message}`);
        res.redirect(req.body._backUrl || CONFIG.router.helpers.Admin.Users.url());
      });
    },

    unban(req, res) {
      User.query().where({ id: req.params.id })
      .then(([firstUser]) => {
        firstUser.banned = false;
        return firstUser.save();
      })
      .then(() => {
        req.flash('success', 'User unbanned succesfully');
        res.redirect(req.body._backUrl || CONFIG.router.helpers.Admin.Users.url());
      })
      .catch((error) => {
        req.flash('error', `An error was occurred: ${error.message}`);
        res.redirect(req.body._backUrl || CONFIG.router.helpers.Admin.Users.url());
      });
    },
  },
});

module.exports = new Admin.UsersController();
