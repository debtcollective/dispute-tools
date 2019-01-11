/* globals Class */
const { Sentry } = require('$lib');
const passport = require('$lib/passport');
const sso = require('$services/sso');
const config = require('$config/config');
const BaseController = require('$lib/core/controllers/BaseController');

const SessionsController = Class('SessionsController').inherits(BaseController)({
  prototype: {
    create(req, res) {
      return res.redirect(sso.buildRedirect(config.router.helpers.callback.url()));
    },

    destroy(req, res, next) {
      req.session.destroy(err => {
        if (err) return next(err);

        req.logout();
        req.flash('success', 'Signed off');

        res.redirect(config.router.helpers.root.url());
      });
    },

    callback(req, res, next) {
      return passport.authenticate('discourse', (err, user) => {
        if (err) {
          req.flash(
            'error',
            'Unable to login. Please try again or <a href="/contact">Contact us</a> if the error persists.',
          );

          Sentry.captureException(err);
          return res.redirect(config.router.helpers.root.url());
        }

        if (user.banned) {
          req.flash('warning', 'This account is suspended.');

          return res.redirect(config.router.helpers.root.url());
        }

        return req.logIn(user, loginError => {
          if (loginError) {
            return next(loginError);
          }

          return req.session.save(() => {
            const redirectTo =
              req.session.redirectTo || config.router.mappings.Disputes.myDisputes.url();

            // remove redirectTo
            req.session.redirectTo = '';

            Sentry.configureScope(scope => {
              scope.setUser({ email: user.email, id: user.id, externalId: user.externalId });
            });

            res.redirect(redirectTo);
          });
        });
      })(req, res, next);
    },
  },
});

module.exports = new SessionsController();
