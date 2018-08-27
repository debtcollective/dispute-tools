const config = require('../config/config');
const Router = require('../config/RouteMappings');
const _ = require('lodash');
const moment = require('moment');

const {
  sso: { logout },
  discourse: { baseUrl: discourseEndpoint },
  environment,
  stripe: { publishable },
} = config;

const marked = require('marked');
const { US_STATES } = require('../lib/data');

module.exports = function locals(req, res, next) {
  res.locals.routeMappings = Router.mappings;
  // Add an additional property to the logout mapping
  // that references the SSO provider's logout endpoint
  res.locals.routeMappings.logout.sso = {
    url() {
      return logout;
    },
  };
  res.locals.currentURL = req.url;
  res.locals.discourseEndpoint = discourseEndpoint;
  res.locals.NODE_ENV = environment;
  res.locals.marked = marked;
  res.locals.US_STATES = US_STATES;
  res.locals.CONFIG = config;
  res.locals.hasAdminRoles =
    req.user && (req.user.admin || req.user.groups.includes('dispute_pro'));

  // DonationFlow
  res.locals.STRIPE_PUBLISHABLE_KEY = publishable;

  res.locals.logo = {
    primary:
      'https://s3.amazonaws.com/tds-static/img/debtcollective/0.0.1/DC-logo_FULL_WHITE@3x.png',
    secondary:
      'https://s3.amazonaws.com/tds-static/img/debtcollective/0.0.1/DC-logo_FULL_DARK_CUTOUTfoot_@3x.png',
  };

  res.locals.lodash = _;
  res.locals.moment = moment;

  res.locals.slugify = (str = '') => str.toLowerCase().replace(/\W/g, '-');

  return next();
};
