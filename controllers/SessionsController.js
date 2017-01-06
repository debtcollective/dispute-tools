/* globals Class, BaseController, CONFIG, User, UserMailer */

const path = require('path');
const bcrypt = require('bcrypt-node');
const Promise = require('bluebird');
const uuid = require('uuid');

const passport = require(path.join(process.cwd(), 'lib', 'passport', 'local_strategy'));

const SessionsController = Class('SessionsController').inherits(BaseController)({
  prototype: {
    new(req, res) {
      res.render('sessions/new');
    },

    create(req, res, next) {
      if (req.user) {
        req.flash('info', 'You are already logged in');

        return res.redirect(CONFIG.router.helpers.login.url());
      }

      passport.authenticate('local', (err, user) => {
        if (err) {
          return res.status(400).render('sessions/new', {
            error: err.message,
            _formData: req.body,
          });
        }

        if (user.banned) {
          req.flash('error', 'This account is currently suspended. <a href="#">Contact</a> us if you think this is a mistake.');
          res.redirect(CONFIG.router.helpers.login.url());
          next();
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          req.flash('success', 'Welcome to The Debt Collective');

          return res.redirect(CONFIG.router.helpers.root.url());
        });
      })(req, res, next);
    },

    destroy(req, res) {
      req.logout();

      req.flash('success', 'Signed off');

      res.redirect(CONFIG.router.helpers.root.url());
    },

    showEmailForm(req, res) {
      res.render('sessions/showEmailForm');
    },

    sendResetEmail(req, res, next) {
      Promise.coroutine(function* sendResetEmailCoroutine() {
        const user = yield User.query()
          .include('account')
          .where('email', req.body.email);

        if (user.length !== 1) {
          return res.status(400).render('sessions/showEmailForm', {
            error: 'No account was found with that email address.',
          });
        }

        user[0].resetPasswordToken = uuid.v4();

        return user[0].save().then(() => {
          return UserMailer.sendResetPasswordLink(user[0].email, {
            user: user[0],
            _options: {
              subject: 'Reset your password - The Debt Collective',
            },
          })
          .then(() => {
            req.flash('success', 'Check your email to reset your password');
            return res.redirect(CONFIG.router.helpers.login.url());
          });
        });
      })()
      .catch(next);
    },

    showPasswordForm(req, res, next) {
      User.query()
        .include('account')
        .where('reset_password_token', req.params.token)
        .then((result) => {
          if (result.length !== 1) {
            req.flash('error', 'Invalid reset password token');
            return res.redirect(CONFIG.router.helpers.resetPassword.url());
          }

          return res.render('sessions/showPasswordForm', {
            token: req.params.token,
          });
        })
        .catch(next);
    },

    resetPassword(req, res, next) {
      Promise.coroutine(function* resetPasswordCoroutine() {
        const user = yield User.query()
          .include('account')
          .where('reset_password_token', req.params.token);

        if (user.length !== 1) {
          return res.status(400).render('sessions/showPasswordForm', {
            token: req.params.token,
            error: 'Invalid reset password token',
          });
        }

        if (req.body.password !== req.body.confirmPassword) {
          return res.status(400).render('sessions/showPasswordForm', {
            token: req.params.token,
            error: 'Passwords mismatch',
          });
        }

        user[0].password = req.body.password;
        user[0].resetPasswordToken = null;


        return user[0].save()
          .then(() => {
            req.flash('success', 'Your password has been reset successfully.');
            return res.redirect(CONFIG.router.helpers.login.url());
          })
          .catch((err) => {
            if (err.errors) {
              res.locals.errors = err.errors;

              res.status(400);

              return res.render('sessions/showPasswordForm', {
                token: req.params.token,
              });
            }

            return next(err);
          });
      })().catch(next);
    },
  },
});

module.exports = new SessionsController();
