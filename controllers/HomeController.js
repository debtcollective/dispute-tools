/* globals Class, BaseController */

const stripe = require('stripe');
const { ContactUsEmail, RecurringDonationEmail } = require('$services/messages');
const Router = require('$config/RouteMappings');
const { logger } = require('$lib');
const config = require('$config/config');

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

    index(req, res) {
      if (!req.user || req.query.hasOwnProperty('donate')) {
        res.render('home/index.pug');
      } else {
        res.redirect(Router.mappings.DisputeTools.url());
      }
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

    healthCheck(req, res) {
      res.send('service is running');
    },

    async sendContact(req, res, next) {
      const { email, message, name } = req.body;

      const contactUsEmail = new ContactUsEmail(message, email, name);
      try {
        await contactUsEmail.send();
        logger.info(
          `Successfully sent contact us email to ${name} <${email}> and the Debt Collective organizers`,
          contactUsEmail.toString(),
        );
        req.flash('success', 'Your message has been sent, thank you for contacting us.');
        res.redirect(Router.mappings.contact.url());
        next();
      } catch (e) {
        logger.error('Unable to send contact us email', e.message, contactUsEmail.toString());
        req.flash(
          'error',
          `Your message was not able to be sent. Please verify your contact information and try again. If the problem persists, please contact the organizers directly at ${contactEmail}`,
        );
        next(e);
      }
    },
  },
});

module.exports = new HomeController();
