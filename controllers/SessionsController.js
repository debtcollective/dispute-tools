/* globals Class */
const SSO = require('$services/sso');
const config = require('$config/config');
const BaseController = require('$lib/core/controllers/BaseController');

const SessionsController = Class('SessionsController').inherits(BaseController)({
  prototype: {
    create(req, res) {
      const defaultRedirectTo = `${req.protocol}://${
        req.headers.host
      }${config.router.mappings.Disputes.myDisputes.url()}`;

      const redirectTo = req.session.redirectTo || defaultRedirectTo;
      return res.redirect(SSO.buildRedirect(redirectTo));
    },

    destroy(req, res, next) {
      req.session.destroy(err => {
        if (err) return next(err);

        req.flash('success', 'Signed off');

        res.redirect(config.router.helpers.root.url());
      });
    },
  },
});

module.exports = new SessionsController();
