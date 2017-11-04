/* globals Class, RestfulController, User, NotFoundError,
CONFIG, Collective, Account, DisputeTool */
const Promise = require('bluebird');
const fs = require('fs-extra');

const UsersController = Class('UsersController').inherits(RestfulController)({
  beforeActions: [
    {
      before: ['_loadUser'],
      actions: ['show', 'edit', 'update', 'destroy'],
    },
  ],

  prototype: {
    _loadUser(req, res, next) {
      const query = User.query()
        .include('[account, disputes.statuses.disputeTool]');

      query
        .where('id', req.params.id)
        .then((result) => {
          if (result.length === 0) {
            return next(new NotFoundError(`User ${req.params.id}  not found)`));
          }

          return req.restifyACL(result)
            .then(([_result]) => {
              if (!_result) {
                const err = new Error();
                err.name = 'ForbiddenError';
                return next(err);
              }

              res.locals.user = _result;

              return Promise.each(res.locals.user.disputes, (dispute) =>
                DisputeTool.first({ id: dispute.disputeToolId })
                  .then((disputeTool) => {
                    dispute.disputeTool = disputeTool;
                    return true;
                  }));
            })
            .finally(() => next());
        })
        .catch((err) => {
          next(err);
        });
    },

    index(req, res) {
      res.status(501).send('Not implemented');
    },

    show(req, res) {
      if (req.user.id !== res.locals.user.id) {
        const _disputes = [];

        if (!res.locals.user.account.disputesPrivate) {
          res.locals.user.disputes.forEach((dispute) => {
            if (dispute.statuses[0].status !== 'Incomplete') {
              _disputes.push(dispute);
            }
          });
        }

        res.locals.user.disputes = _disputes;
      }

      res.render('users/show.pug');
    },

    new(req, res) {
      res.render('users/new.pug');
    },

    create(req, res) {
      const user = new User(req.body);
      const account = new Account(req.body);

      user.role = 'User';

      if (!Array.isArray(req.body.collectiveIds)) {
        req.body.collectiveIds = [req.body.collectiveIds];
      }

      User.transaction((trx) => user.transacting(trx).save()
          .then(() => {
            account.userId = user.id;
            return account.transacting(trx).save();
          })
          .then(() => User.knex()
              .table('UsersCollectives')
              .where('user_id', user.id)
              .transacting(trx)
              .del())
          .then(() => {
            const userCollectives = req.body.collectiveIds.map((collectiveId) => ({
              user_id: user.id,
              collective_id: collectiveId,
            }));

            return User.knex()
              .table('UsersCollectives')
              .transacting(trx)
              .insert(userCollectives);
          })
          .then(() => Promise.each(req.body.collectiveIds, (collectiveId) => Collective.query()
            .transacting(trx)
            .where('id', collectiveId)
            .then(([collective]) => {
              collective.userCount++;

              return collective
                .transacting(trx)
                .save();
            })))
          .then(trx.commit)
          .catch(trx.rollback)).then(() => {
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

      delete req.body.role;

      // The front-end tends to send back "on" instead of a boolean primitive
      // for when the checkbox is selected and nothing if it's not selected so
      // this is the most consistent way to get the boolean primitive Knex is
      // expecting
      req.body.private = req.body.private !== undefined;
      req.body.disputesPrivate = req.body.disputesPrivate !== undefined;

      user.updateAttributes(req.body);
      user.account.updateAttributes(req.body);

      User.transaction((trx) => user.transacting(trx).save()
          .then(() => {
            if (req.files && req.files.image && req.files.image.length > 0) {
              const image = req.files.image[0];

              return user.account.attach('image', image.path, {
                fileSize: image.size,
                mimeType: image.mimetype || image.mimeType,
              })
              .then(() => {
                fs.unlinkSync(image.path);

                return user.account.transacting(trx).save();
              });
            }

            return user.account.transacting(trx).save();
          })
          .finally(trx.commit)
          .catch(trx.rollback))
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

        const user = users[0];

        user.activationToken = null;

        return user.save().then(() => {
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }

            req.flash('success', 'Welcome! Your account was succesfully activated.');
            return res.redirect(CONFIG.router.helpers.Collectives.url());
          });
        });
      })()
      .catch(next);
    },
  },
});

module.exports = new UsersController();
