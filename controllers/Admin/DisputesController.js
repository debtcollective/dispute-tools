/* globals Class, Admin */
const _ = require('lodash');
const Promise = require('bluebird');
const Dispute = require('$models/Dispute');
const { discourse } = require('$lib');
const { NotFoundError } = require('$lib/errors');
const DisputeTool = require('$models/DisputeTool');
const DisputeStatus = require('$models/DisputeStatus');
const config = require('$config/config');
const RestfulController = require('$libcore/controllers/RestfulController');

const {
  authenticate,
  authorize,
  tests: { isDisputeAdmin },
} = require('$services/auth');

const RESTfulAPI = require('$lib/RESTfulAPI');

global.Admin = global.Admin || {};

Admin.DisputesController = Class(Admin, 'DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [authenticate, authorize(isDisputeAdmin)],
      actions: ['*'],
    },
    {
      before: '_loadDispute',
      actions: [
        'update',
        'destroy',
        'updateAdmins',
        'getAvailableAdmins',
        'show',
        'updateDisputeData',
        'downloadAttachment',
        'addAttachment',
        'deleteAttachment',
      ],
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
              pageSize: 5,
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
        .include('[user, statuses, attachments, disputeTool, admins]')
        .then(([dispute]) => {
          res.locals.dispute = dispute;
          req.dispute = dispute;
          next();
        })
        .catch(next);
    },

    async index(req, res) {
      res.locals.disputes = res.locals.results;
      res.locals.statuses = DisputeStatus.statuses;

      const users = await discourse.getUsers({
        params: { ids: _.uniq(res.locals.disputes.map(({ user }) => user.externalId)).join(',') },
      });

      res.locals.disputes.forEach(dispute => {
        dispute.user.setInfo(users.find(u => u.externalId === dispute.user.externalId) || {});
      });

      res.locals.headers = {
        total_count: ~~res._headers.total_count,
        total_pages: ~~res._headers.total_pages,
        current_page: ~~req.query.page || 1,
        query: req.query,
      };

      res.render('admin/disputes/index');
    },

    async show(req, res) {
      res.format({
        html() {
          res.render('admin/disputes/show');
        },
        json() {
          res.send(res.locals.dispute);
        },
      });
    },

    async update(req, res, next) {
      const dispute = res.locals.dispute;

      try {
        await DisputeStatus.createForDispute(dispute, req.body);

        req.flash('success', 'The dispute status has been updated.');
        res.redirect(config.router.helpers.Admin.Disputes.url());
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

    async updateDisputeData(req, res, next) {
      try {
        await req.dispute.setForm(req.body);
        await req.dispute.save();
        req.flash('success', 'The dispute has been updated.');
        res.redirect(config.router.helpers.Admin.Disputes.show.url(req.dispute.id));
      } catch (e) {
        next(e);
      }
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          req.flash('warning', 'The Dispute has been deactivated.');
          return res.redirect(config.router.helpers.Admin.Disputes.url());
        })
        .catch(next);
    },

    async downloadAttachment(req, res, next) {
      const attachment = req.dispute.attachments.find(a => a.id === req.params.aid);
      if (!attachment) {
        next(
          // prettier-ignore
          new NotFoundError(`Could not find attachment with id ${req.params.aid} for dispute with id ${req.params.id}`),
        );
      } else {
        res.redirect(attachment.file.url('original'));
      }
    },

    async deleteAttachment(req, res, next) {
      const attachment = req.dispute.attachments.find(a => a.id === req.params.aid);
      if (!attachment) {
        next(
          // prettier-ignore
          new NotFoundError(`Could not find attachment with id ${req.params.aid} for dispute with id ${req.params.id}`),
        );
      } else {
        await attachment.destroy();
        res.send(204, {});
      }
    },
  },
});

module.exports = new Admin.DisputesController();
