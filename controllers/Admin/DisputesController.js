/* globals neonode, Class, Admin, RestfulController, DisputeTool, CONFIG, Dispute,
 DisputeMailer, DisputeStatus, logger, User */
const path = require('path');
const Promise = require('bluebird');
const Dispute = require('../../models/Dispute');

const { authenticate, authorize, tests: { isDisputeAdmin } } = require('../../services/auth');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

global.Admin = global.Admin || {};

Admin.DisputesController = Class(Admin, 'DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [authenticate, authorize(isDisputeAdmin)],
      actions: ['*'],
    },
    {
      before: '_loadDispute',
      actions: ['update', 'destroy', 'updateAdmins', 'getAvailableAdmins'],
    },
    {
      before(req, res, next) {
        const query = Dispute.query();

        Promise.coroutine(function* restfulAPI() {
          const disputeIds = yield Dispute.search(req.query);

          query.whereIn('id', disputeIds);
        })().then(() => {
          RESTfulAPI.createMiddleware({
            queryBuilder: query
              .where('deactivated', false)
              .include('[user, attachments, disputeTool, admins]'),
            order: {
              default: '-updated_at',
              allowedFields: ['created_at', 'updated_at'],
            },
            paginate: {
              pageSize: 50,
            },
          })(req, res, next);
        });
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        DisputeTool.query()
          .orderBy('created_at', 'ASC')
          .then(disputeTools => {
            res.locals.disputeTools = disputeTools.map(dispute => ({
              id: dispute.id,
              name: dispute.name,
            }));
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        Promise.mapSeries(res.locals.results, result =>
          DisputeStatus.query()
            .where({
              dispute_id: result.id,
            })
            .orderBy('created_at', 'DESC')
            .then(statuses => {
              result.statuses = statuses;
              return Promise.resolve();
            }),
        )
          .then(() => {
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
        .include('[statuses, attachments, disputeTool, admins.[account]]')
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

      res.locals.headers = {
        total_count: ~~res._headers.total_count,
        total_pages: ~~res._headers.total_pages,
        current_page: ~~req.query.page || 1,
        query: req.query,
      };

      res.render('admin/disputes/index');
    },

    async update(req, res, next) {
      const dispute = res.locals.dispute;

      try {
        await DisputeStatus.createForDispute(dispute, req.body);

        req.flash('success', 'The dispute status has been updated.');
        res.redirect(CONFIG.router.helpers.Admin.Disputes.url());
      } catch (e) {
        next(e);
      }
    },

    getAvailableAdmins(req, res, next) {
      req.dispute
        .getAssignedAndAvailableAdmins()
        .then(r => res.status(200).send(r))
        .catch(next);
    },

    updateAdmins(req, res, next) {
      req.dispute
        .updateAdmins(req.body)
        .then(() => {
          req.flash('success', 'The list of administrators assigned as been updated.');
          res.status(200).send({});
        })
        .catch(next);
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          req.flash('warning', 'The Dispute has been deactivated.');
          return res.redirect(CONFIG.router.helpers.Admin.Disputes.url());
        })
        .catch(next);
    },
  },
});

module.exports = new Admin.DisputesController();
