/* globals Class, BaseController, logger, CONFIG, UserMailer, ContactMailer */

const stripe = require('stripe');
const sso = require('../services/sso');

const {
  stripe: { secret: stripeSecret },
  mailers: { contactEmail: CONTACT_EMAIL },
  siteURL,
} = CONFIG;

const stripeClient = stripe(stripeSecret);

const HomeController = Class('HomeController').inherits(BaseController)({
  prototype: {
    donate(req, res) {
      const token = req.body.token;
      const amount = Math.floor(Number(req.body.amount));

      // recurrent donations requires customers and plans
      const planId = `monthly-${req.body.amount}c-plan`;

      const createCustomer = () =>
        new Promise((resolve, reject) => {
          stripeClient.customers.create(
            {
              email: req.body.email,
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
          .then(subscription => {
            // send email for more info
            UserMailer.sendSubscription(req.body.email, {
              amount,
              _options: {
                subject: 'Your donation - The Debt Collective',
              },
            });

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

    startpage(req, res) {
      res.render('home/startpage.pug');
    },

    index(req, res) {
      if (!req.user) res.render('home/index.pug');
      else res.redirect(CONFIG.router.helpers.DisputeTools.url());
    },

    about(req, res) {
      res.render('home/about');
    },

    vision(req, res) {
      res.render('home/vision');
    },

    contact(req, res) {
      res.render('home/contact');
    },

    sendContact(req, res, next) {
      const { email, message, name } = req.body;
      const emailerOptions = {
        email,
        message,
        name,
        _options: {
          from: `${name} <${email}>`,
        },
      };

      ContactMailer.sendMessage(CONTACT_EMAIL, emailerOptions)
        .then(result => {
          logger.info('ContactMailer.sendMessage result', result);
          req.flash('success', 'Your message has been sent, thank you for contacting us.');
          res.redirect(CONFIG.router.helpers.contact.url());
          next();
        })
        .catch(next);
    },

    dtr(req, res) {
      res.render('home/dtr.pug');
    },

    tos(req, res) {
      res.render('home/tos.pug');
    },

    tools(req, res) {
      res.render('home/tools');
    },

    tool(req, res) {
      res.render('home/tool');
    },

    login(req, res) {
      res.send({ redirect: sso.buildRedirect(req, req.body.returnTo) });
    },

    logout(req, res) {
      // Expire the cookie right away to invalidate it
      res.cookie('dispute-tool', '', { expires: new Date() });
      res.redirect(siteURL);
    },
  },
});

module.exports = new HomeController();
