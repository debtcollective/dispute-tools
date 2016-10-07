/* globals Class, RestfulController, User, NotFoundError,
CONFIG, Collective, Account, DisputeTool */
const Promise = require('bluebird');
const fs = require('fs-extra');

const UsersController = Class('UsersController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadUser',
      actions: ['show', 'edit', 'update', 'destroy'],
    },
  ],

  prototype: {
    _loadUser(req, res, next) {
      User.query()
        .include('[account, disputes.statuses]')
        .where('id', req.params.id)
        .then((result) => {
          if (result.length === 0) {
            return next(new NotFoundError(`User ${req.params.id}  not found)`));
          }

          return req.restifyACL(result)
            .then((_result) => {
              res.locals.user = _result[0];

              return Promise.each(res.locals.user.disputes, (dispute) => {
                return DisputeTool.first({ id: dispute.disputeToolId })
                  .then((disputeTool) => {
                    dispute.disputeTool = disputeTool;
                    return true;
                  });
              });
            })
            .finally(() => {
              return next();
            });
        })
        .catch((err) => {
          next(err);
        });
    },

    index(req, res) {
      res.status(501).send('Not implemented');
    },

    show(req, res) {
      res.render('users/show.pug');
    },

    new(req, res) {
      res.render('users/new.pug');
    },

    create(req, res) {
      const user = new User(req.body);
      const account = new Account(req.body);

      user.role = 'User';

      User.transaction((trx) => {
        return user.transacting(trx).save()
          .then(() => {
            account.userId = user.id;
            return account.transacting(trx).save();
          })
          .then(() => {
            return User.knex()
              .table('UsersCollectives')
              .where('user_id', user.id)
              .transacting(trx)
              .del();
          })
          .then(() => {
            if (!Array.isArray(req.body.collectiveIds)) {
              req.body.collectiveIds = [req.body.collectiveIds];
            }

            return Promise.each(req.body.collectiveIds, (collectiveId) => {
              return User.knex()
                .table('UsersCollectives')
                .transacting(trx)
                .insert({
                  user_id: user.id,
                  collective_id: collectiveId,
                });
            });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      }).then(() => {
        user.account = account;
        return user.sendActivation();
      })
      .then(() => {
        res.render('users/activation.pug', {
          email: user.email,
        });
      })
      .catch((err) => {
        res.status(400);

        if (err.message === 'Must provide a password') {
          err.errors = err.errors || {
            password: `password: ${err.message}`,
          };
        }

        res.locals.errors = err.errors || err;

        res.render('users/new.pug', {
          _formData: req.body,
        });
      });
    },

    edit(req, res) {
      res.render('users/edit.pug');
    },

    update(req, res) {
      const user = res.locals.user;

      user.updateAttributes(req.body);
      user.account.updateAttributes(req.body);

      user.role = user.role;

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
        if (!user.activationToken) {
          req.flash('success', 'Profile updated succesfully');
          return res.redirect(CONFIG.router.helpers.Users.show.url(req.params.id));
        }

        return user.sendActivation()
          .then(() => {
            req.logout();

            res.render('users/activation.pug', {
              email: user.email,
            });
          });
      })
      .catch((err) => {
        res.status(400);

        res.locals.errors = err.errors || err;

        res.render('users/edit.pug');
      });
    },

    destroy(req, res) {
      res.status(501).send('Not implemented');
    },

    activation(req, res) {
      res.render('users/activation.pug');
    },

    activate(req, res, next) {
      Promise.coroutine(function* activateCoroutine() {
        const users = yield User.query().where('activation_token', req.params.token);

        if (users.length !== 1) {
          req.flash('error', 'Invalid activation token');
          return res.redirect(CONFIG.router.helpers.login.url());
        }

        users[0].activationToken = null;

        return users[0].save().then(() => {
          req.flash('success', 'Your account was succesfully activated');
          res.redirect(CONFIG.router.helpers.login.url());
        });
      })()
      .catch(next);
    },
  },
});

module.exports = new UsersController();
