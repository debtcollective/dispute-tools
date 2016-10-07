/* globals Class, CONFIG, Dispute */
const path = require('path');
const Promise = require('bluebird');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

global.Admin = global.Admin || {};

Admin.DisputesController = Class(Admin, 'DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadDispute',
      actions: [
        'show',
        'destroy',
      ],
    },
    {
      before(req, res, next) {
        RESTfulAPI.createMiddleware({
          queryBuilder: Dispute.query()
            .where('deleted', false)
            .include('[user.account, statuses, attachments, disputeTool]'),
          filters: {
            allowedFields: [],
          },
        })(req, res, next);
      },
      actions: ['index'],
    },
  ],
  prototype: {
    _loadDispute(req, res, next) {
      Dispute.query()
        .where({ id: req.params.id })
        .include('[statuses, attachments, disputeTool]')
        .then(([dispute]) => {
          res.locals.dispute = dispute;
          req.dispute = dispute;

          const optionData = dispute.disputeTool.data.options[dispute.data.option];
          if (optionData.more) {
            optionData.more = marked(optionData.more);
          }

          next();
        })
        .catch(next);
    },

    index(req, res) {
      res.locals.disputes = res.locals.results;

      res.render('admin/disputes/index');
    },

    show(req, res) {
      res.render('admin/disputes/show');
    },

    edit(req, res) {
      res.render('admin/disputes/edit');
    },

    new(req, res) {
      res.send(501, 'Not Implemented');
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          return res.redirect(CONFIG.router.helpers.Admin.Disputes.url());
        })
        .catch(next);
    },
  },
});

module.exports = new Admin.DisputesController();
