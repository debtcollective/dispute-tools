/* globals Admin, Class, RestfulController, User, NotFoundError,
CONFIG, Collective, Account, DisputeTool */

const fs = require('fs-extra');
const path = require('path');

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
        RESTfulAPI.createMiddleware({
          queryBuilder: User.query()
            .include('[account, debtTypes]'),
          filters: {
            allowedFields: [

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
      res.render('users/edit.pug');
    },

    update(req, res) {
      const user = res.locals.user;

      user.updateAttributes(req.body);
      user.account.updateAttributes(req.body);

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
