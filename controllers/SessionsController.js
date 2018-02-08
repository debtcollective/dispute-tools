/* globals Class, BaseController, CONFIG, User, UserMailer */

const path = require('path');
const Promise = require('bluebird');
const uuid = require('uuid');
const includes = require('lodash/includes');

const passport = require(path.join(
  process.cwd(),
  'lib',
  'passport',
  'local_strategy',
));

const SessionsController = Class('SessionsController').inherits(BaseController)(
  {
    prototype: {
      new(req, res) {
        res.render('sessions/new');
      },

      create(req, res, next) {
        if (req.user) {
          req.flash('info', 'You are already logged in');

          return res.redirect(CONFIG.router.helpers.login.url());
        }

        return passport.authenticate('local', (err, user) => {
          if (err) {
            return res.status(400).render('sessions/new', {
              error: err.message,
              _formData: req.body,
            });
          }

          if (user.banned) {
            req.flash(
              'warning',
              // eslint-disable-next-line max-len
              'This account is currently suspended. <a href="/contact">Contact us</a> if you think this is a mistake.',
            );
            res.redirect(CONFIG.router.helpers.login.url());
            next();
          }

          return req.login(user, loginError => {
            if (loginError) {
              return next(loginError);
            }
            req.flash('success', 'Welcome to The Debt Collective');

            const referer = req.headers.referer;

            // Ignore if referer is login page
            if (
              referer &&
              !includes(referer, CONFIG.router.helpers.login.url())
            ) {
              return res.redirect(req.headers.referer);
            }

            return res.redirect(CONFIG.router.helpers.dashboard.url());
          });
        })(req, res, next);
      },

      showEmailForm(req, res) {
        res.render('sessions/showEmailForm');
      },

      destroy(req, res) {
        req.logout();

        req.flash('success', 'Signed off');

        res.redirect(CONFIG.router.helpers.root.url());
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

          return user[0].save().then(() =>
            UserMailer.sendResetPasswordLink(user[0].email, {
              user: user[0],
              _options: {
                subject: 'Reset your password - The Debt Collective',
              },
            }).then(() => {
              req.flash('success', 'Check your email to reset your password');
              return res.redirect(CONFIG.router.helpers.login.url());
            }),
          );
        })().catch(next);
      },

      showPasswordForm(req, res, next) {
        User.query()
          .include('account')
          .where('reset_password_token', req.params.token)
          .then(result => {
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

          return user[0]
            .save()
            .then(() => {
              req.flash(
                'success',
                'Your password has been reset successfully.',
              );
              return res.redirect(CONFIG.router.helpers.login.url());
            })
            .catch(err => {
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
  },
);

module.exports = new SessionsController();
