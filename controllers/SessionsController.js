/* globals Class, BaseController, CONFIG, User, UserMailer */

const path = require('path');
const bcrypt = require('bcrypt-node');

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

      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', err.message);

          return res.redirect(CONFIG.router.helpers.login.url());
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          req.flash('sucess', 'Welcome to The Debt Collective');

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
      User.query()
        .where('email', req.body.email)
        .then((result) => {
          if (result.length !== 1) {
            req.flash('error', 'Invalid email');

            return res.redirect(CONFIG.router.helpers.resetPassword.url());
          }

          return result[0];
        })
        .then((user) => {
          user.resetPasswordToken = bcrypt.hashSync(CONFIG.env()
            .sessions.secret + Date.now(), bcrypt.genSaltSync(12), null);

          return UserMailer.sendResetPasswordLink(user.email, {
            user,
            _options: {
              subject: 'Reset your password - The Debt Collective',
            },
          });
        })
        .then(() => {
          req.flash('success', 'Check your email to reset your password');
        })
        .catch(next);
    },

    showPasswordForm(req, res, next) {
      User.query()
        .where('resetPasswordToken', req.params.token)
        .then((result) => {
          if (result !== 1) {
            req.flash('error', 'Invalid reset password token');

            return res.redirect(CONFIG.router.helpers.resetPassword.url());
          }

          res.render('sessions/showPasswordForm');
        })
        .catch(next);
    },

    resetPassword(req, res, next) {
      User.query()
        .where('resetPasswordToken', req.params.token)
        .then((result) => {
          if (result !== 1) {
            req.flash('error', 'Invalid reset password token');

            return res.redirect(CONFIG.router.helpers.resetPassword.url());
          }

          return result[0];
        })
        .then((user) => {
          if (req.body.password !== req.body.confirmPassword) {
            req.flash('error', 'Passwords mismatch');

            return res.redirect(CONFIG.router.helpers
              .resetPasswordWithToken.url(user.resetPasswordToken));
          }

          user.password = req.body.password;
          user.resetPasswordToken = null;

          return user;
        })
        .then((user) => {
          user.save()
            .then(() => {
              req.flash('success', 'Your password has been reset successfully.');
              res.redirect(CONFIG.router.helpers.login.url());
            })
            .catch((err) => {
              if (err.errors) {
                res.locals.errors = err.errors;

                res.status(400);

                return res.render('sessions/showPasswordForm');
              }

              return next(err);
            });
        })
        .catch(next);
    },
  },
});

module.exports = new SessionsController();
