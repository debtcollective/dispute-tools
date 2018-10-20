/* globals Class, BaseController */

const stripe = require('stripe');
const { ContactUsEmail, RecurringDonationEmail } = require('$services/messages');
const Router = require('$config/RouteMappings');
const { Raven, logger } = require('$lib');
const config = require('$config/config');
const request = require('request');

const {
  stripe: { private: stripePrivateKey },
  mailers: { contactEmail },
} = require('$config/config');

const stripeClient = stripe(stripePrivateKey);

const HomeController = Class('HomeController').inherits(BaseController)({
  prototype: {
    donate(req, res) {
      const token = req.body.token;
      const amount = Math.floor(Number(req.body.amount));
      const email = req.body.email;

      // recurrent donations requires customers and plans
      const planId = `monthly-${req.body.amount}c-plan`;

      const createCustomer = () =>
        new Promise((resolve, reject) => {
          stripeClient.customers.create(
            {
              email,
              source: token,
            },
            (err, customer) => {
              if (err) {
                reject(err);
              } else {
                resolve(customer);
              }
            },
          );
        });

      const createPlan = () =>
        new Promise((resolve, reject) => {
          stripeClient.plans.create(
            {
              name: `Donation for Debt Collective: ${amount / 100}`,
              id: planId,
              interval: 'month',
              currency: 'usd',
              amount,
            },
            err => {
              // if the plan already exists, just use it
              if (err) {
                if (err.message.indexOf('already exists') === -1) {
                  reject(err);
                } else {
                  resolve();
                }
              } else {
                resolve();
              }
            },
          );
        });

      const subscribe = customerId =>
        new Promise((resolve, reject) => {
          stripeClient.subscriptions.create(
            {
              customer: customerId,
              plan: planId,
            },
            (err, subscription) => {
              if (err) {
                reject(err);
              } else {
                resolve(subscription);
              }
            },
          );
        });

      const charge = () =>
        new Promise((resolve, reject) => {
          stripeClient.charges.create(
            {
              amount,
              currency: 'usd',
              source: token,
              description: `Donation for Debt Collective: ${amount / 100}`,
            },
            (err, _charge) => {
              if (err) {
                reject(err);
              } else {
                resolve(_charge);
              }
            },
          );
        });

      if (!token) {
        res.status(400).json({
          error: {
            message: 'Invalid token',
          },
        });
        return;
      }

      if (req.body.subscribe) {
        createCustomer()
          .then(customer => createPlan().then(() => subscribe(customer.id)))
          .then(async subscription => {
            let user = req.user;

            // if there's no user, build one for the email
            if (!user) {
              user = {
                name: 'The Debt Collective Supporter',
                email,
              };
            }

            // send email for more info
            const recurringDonationEmail = new RecurringDonationEmail(user, amount);

            try {
              await recurringDonationEmail.send();
              logger.info('Successfully sent RecurringDonationEmail');
            } catch (e) {
              // TODO: Handle this better...
              req.flash(
                'error',
                'Your recurring donation was saved but we were unable to send a confirmation email.',
              );
            }

            return subscription;
          })
          .then(subscription => {
            res.status(200).json({
              success: subscription.status === 'active' && subscription.plan.id === planId,
            });
          })
          .catch(error => {
            logger.error(error);
            res.status(500).json({
              error: { message: 'Something went wrong, please try again.' },
            });
          });
      } else {
        charge()
          .then(_charge => {
            res.status(200).json({
              success: _charge.captured && _charge.paid && _charge.status === 'succeeded',
            });
          })
          .catch(error => {
            logger.error(error);
            res.status(500).json({
              error: { message: 'Something went wrong, please try again.' },
            });
          });
      }
    },

    admin(req, res) {
      res.render('home/admin.pug');
    },

    about(req, res) {
      res.redirect(`${config.landingPageUrl}/#about`);
    },

    vision(req, res) {
      res.render('home/vision');
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
            Raven.captureException(e);
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
