/* globals Admin, Class, RestfulController, User, NotFoundError,
CONFIG, Collective, Account, DisputeTool */

const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

global.Admin = global.Admin || {};

Admin.UsersController = Class(Admin, 'UsersController').inherits(RestfulController)({
  beforeActions: [
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
  ],

  prototype: {
    _loadUser(req, res, next) {
      const query = User.query()
        .include('[account, debtTypes]')
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

      User.transaction((trx) => {
        return user.transacting(trx).save()
          .then(() => {
            if (req.files.image && req.files.image.length > 0) {
              const image = req.files.image[0];

              return user.account.attach('image', image.path, {
                fileSize: image.size,
                mimeType: image.mimeType,
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
            if (user.role !== 'CollectiveAdmin') {
              return Promise.resolve();
            }

            if (!Array.isArray(req.body.collectiveIds)) {
              req.body.collectiveIds = [req.body.collectiveIds];
            }

            const collectiveAdmins = req.body.collectiveIds.map((id) => {
              return {
                user_id: user.id,
                collective_id: id,
              };
            });

            return knex('CollectiveAdmins')
              .transacting(trx)
              .insert(collectiveAdmins);
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
        return res.redirect(CONFIG.router.helpers.Admin.Users.url());
      })
      .catch((err) => {
        res.status(400);

        res.locals.errors = err.errors || err;

        res.render('users/edit.pug');
      });
    },
  },
});

module.exports = new Admin.UsersController();
