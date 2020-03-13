/* globals Class, BaseController */

const { ContactUsEmail } = require('$services/messages');
const Router = require('$config/RouteMappings');
const { Sentry, logger } = require('$lib');
const config = require('$config/config');
const request = require('request');

const {
  donateURL,
  mailers: { contactEmail },
} = require('$config/config');

const HomeController = Class('HomeController').inherits(BaseController)({
  prototype: {
    donate(req, res) {
      res.redirect(donateURL);
    },

    admin(req, res) {
      res.render('home/admin.pug');
    },

    about(req, res) {
      res.redirect(`${config.landingPageUrl}/#about`);
    },

    contact(req, res) {
      res.render('home/contact');
    },

    dtr(req, res) {
      res.redirect(Router.mappings.dtr.url());
    },

    tools(req, res) {
      res.redirect(Router.mappings.root.url());
    },

    tool(req, res) {
      res.redirect(Router.mappings.tool.url(req.params.id));
    },

    healthCheck(req, res) {
      res.send('service is running');
    },

    sendContact(req, res, next) {
      const { name, email, message, 'g-recaptcha-response': recaptchaResponse } = req.body;
      const recaptcha = config.recaptcha;

      const contactUsEmail = new ContactUsEmail(message, email, name);

      request.post(
        {
          url: recaptcha.url,
          form: {
            secret: recaptcha.secretKey,
            response: recaptchaResponse,
            remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          },
          json: true,
        },
        async (error, response, body) => {
          if (error) {
            req.flash('error', 'Theres was a problem sending your message, please try again');
            return res.render('home/contact', {
              name,
              email,
              message,
            });
          }

          if (!body.success) {
            req.flash('error', 'Invalid captcha, please try again');
            return res.render('home/contact', {
              name,
              email,
              message,
            });
          }

          try {
            await contactUsEmail.send();
            req.flash(
              'success',
              'Thank you for getting in touch! One of our colleagues will get back to you shortly.',
            );
            res.redirect(Router.mappings.root.url());
            next();
          } catch (e) {
            Sentry.captureException(e);
            logger.error('Unable to send contact us email', e.message, contactUsEmail.toString());
            req.flash(
              'error',
              `Theres was a problem sending your message, please contact the organizers directly at ${contactEmail}`,
            );
            next();
          }
        },
      );
    },
  },
});

module.exports = new HomeController();
