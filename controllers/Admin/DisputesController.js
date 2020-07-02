/* globals Class, Admin */
const User = require('$models/User');
const Dispute = require('$models/Dispute');
const { NotFoundError } = require('$lib/errors');
const DisputeTool = require('$models/DisputeTool');
const DisputeStatus = require('$models/DisputeStatus');
const DisputeAttachment = require('$models/DisputeAttachment');
const config = require('$config/config');
const RestfulController = require('$lib/core/controllers/RestfulController');
const _ = require('lodash');
const { Sentry, logger } = require('$lib');

const {
  authenticate,
  authorize,
  tests: { isDisputeAdmin },
} = require('$services/auth');

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
        // Load Dispute Tools
        DisputeTool.query()
          .orderBy('created_at', 'ASC')
          .then(disputeTools => {
            res.locals.disputeTools = disputeTools.map(tool => ({
              id: tool.id,
              name: tool.name,
            }));
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
  ],
  prototype: {
    _loadDispute(req, res, next) {
      return Dispute.query()
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
      const [disputes, pagination] = await Dispute.search(req.query);

      // We are not using Krypton `include`
      // Here we add DisputeTool and User to each Dispute in results
      const disputeTools = res.locals.disputeTools;
      const userIdSet = new Set();
      const disputeIdSet = new Set();

      _.forEach(disputes, dispute => {
        disputeIdSet.add(dispute.id);
        userIdSet.add(dispute.userId);
      });

      // fetch Users
      const userIds = Array.from(userIdSet);
      const users = await User.query().whereIn('id', userIds);

      // fetch attachments and statuses
      const disputeIds = Array.from(disputeIdSet);
      const attachments = await DisputeAttachment.query().whereIn('foreign_key', disputeIds);
      const statuses = await DisputeStatus.query().whereIn('dispute_id', disputeIds);

      // Add joins data to each Dispute
      _.forEach(disputes, dispute => {
        dispute.disputeTool = _.find(disputeTools, { id: dispute.disputeToolId });
        dispute.user = _.find(users, { id: dispute.userId });
        dispute.attachments = _.filter(attachments, { foreignKey: dispute.id });
        dispute.statuses = _.filter(statuses, { disputeId: dispute.id });
      });

      res.locals.disputes = disputes;
      res.locals.statuses = DisputeStatus.statuses;

      res.locals.headers = {
        total_pages: ~~pagination.totalPages,
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

    async update(req, res) {
      const dispute = res.locals.dispute;

      try {
        await DisputeStatus.createForDispute(dispute, req.body);

        req.flash('success', 'The dispute status has been updated.');
      } catch (e) {
        req.flash('error', e.message);
      }
      res.redirect(config.router.helpers.Admin.Disputes.url());
    },

    getAvailableAdmins(req, res, next) {
      req.dispute
        .getAssignedAndAvailableAdmins()
        .then(r => res.status(200).send(r))
        .catch(e => {
          Sentry.captureException(e);
          logger.error(e.message);
          next(e);
        });
    },

    updateAdmins(req, res, next) {
      req.dispute
        .updateAdmins(req.body)
        .then(() => {
          req.flash('success', 'The list of administrators assigned as been updated.');
          res.status(200).send({});
        })
        .catch(e => {
          Sentry.captureException(e);
          logger.error(e.message);
          next(e);
        });
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
          req.flash('success', 'The dispute has been deleted.');
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
