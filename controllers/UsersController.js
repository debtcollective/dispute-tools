/* globals Class, RestfulController, User, NotFoundError, CONFIG */

const Promise = require('bluebird');

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
        .where('id', req.params.id)
        .then((result) => {
          if (result.length === 0) {
            return next(new NotFoundError(`User ${req.params.id}  not found)`));
          }

          return req.restifyACL(result)
            .then((_result) => {
              res.locals.user = _result[0];
              return next();
            });
        })
        .catch(next);
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

      user.role = 'User';

      user.save()
        .then(() => {
          res.redirect(CONFIG.router.helpers.Users.activation.url());
        })
        .catch((err) => {
          res.status(400);

          res.locals.errors = err.errors;

          res.render('users/new.pug');
        });
    },

    edit(req, res) {
      res.render('users/edit.pug');
    },

    update(req, res) {
      const user = res.locals.user;

      user.updateAttributes(req.body);

      user.role = 'User';

      user.save()
        .then(() => {
          res.redirect(CONFIG.router.helpers.Users.show.url(req.params.id));
        })
        .catch((err) => {
          res.status(400);

          res.locals.errors = err.errors;

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
          return res.status(400).render('users/activate');
        }

        users[0].activationToken = null;

        return users[0].save().then(() => {
          res.redirect(CONFIG.router.helpers.login.url());
        });
      })()
      .catch(next);
    },
  },
});

module.exports = new UsersController();
