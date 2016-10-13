/* globals Class, Admin, RestfulController, DisputeTool, CONFIG, Dispute,
 DisputeMailer, DisputeStatus */
const path = require('path');
// const Promise = require('bluebird');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

global.Admin = global.Admin || {};

Admin.DisputesController = Class(Admin, 'DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadDispute',
      actions: [
        'show',
        'update',
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
    {
      before(req, res, next) {
        DisputeTool.query()
          .orderBy('created_at', 'ASC')
          .then((disputeTools) => {
            res.locals.disputeTools = disputeTools.map(dispute => {
              return {
                id: dispute.id,
                name: dispute.name,
              };
            });
            next();
          })
          .catch(next);
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

          next();
        })
        .catch(next);
    },

    index(req, res) {
      res.locals.disputes = res.locals.results;
      res.locals.statuses = DisputeStatus.statuses;

      res.render('admin/disputes/index');
    },

    show(req, res) {
      res.render('admin/disputes/show');
    },

    edit(req, res) {
      res.render('admin/disputes/edit');
    },

    update(req, res, next) {
      const dispute = res.locals.dispute;

      const { comment, status } = req.body;

      const ds = new DisputeStatus({
        comment,
        status,
        disputeId: dispute.id,
      });

      ds.save()
        .then(() => {
          return DisputeMailer.sendStatusToUser({
            dispute,
            disputeStatus: ds,
          });
        })
        .then(() => {
          return res.redirect(CONFIG.router.helpers.Admin.Disputes.url());
        })
        .catch(next);
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
