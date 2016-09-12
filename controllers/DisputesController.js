/* globals Dispute, RestfulController, Class, DisputeTool, CONFIG, DisputeStatus, DisputeMailer */

const path = require('path');
const Promise = require('bluebird');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

const DisputesController = Class('DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadDispute',
      actions: [
        'show',
        'edit',
        'update',
        'updateDisputeData',
        'setSignature',
        'addAttachment',
        'destroy',
      ],
    },
    {
      before(req, res, next) {
        // Load the dispute tool record to use its #createDispute method
        if (!req.body.disputeToolId) {
          return next(new Error('Invalid parameters'));
        }

        return DisputeTool
          .first({ id: req.body.disputeToolId })
          .then((disputeTool) => {
            res.locals.disputeTool = disputeTool;

            return next();
          })
          .catch(next);
      },
      actions: ['create'],
    },
    {
      before(req, res, next) {
        RESTfulAPI.createMiddleware({
          queryBuilder: Dispute.query()
            .where('deleted', false)
            .include('[statuses, attachments, disputeTool]'),
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
          next();
        })
        .catch(next);
    },
    index(req, res) {
      res.locals.disputes = res.locals.results;

      res.render('disputes/index');
    },

    show(req, res) {
      res.render('disputes/show');
    },

    edit(req, res) {
      res.render('disputes/edit');
    },

    new(req, res) {
      res.send(501, 'Not Implemented');
    },

    create(req, res, next) {
      const disputeTool = res.locals.disputeTool;

      disputeTool.createDispute({
        option: req.body.option,
        user: req.user,
      })
      .then((disputeId) => {
        return res.redirect(CONFIG.router.helpers.Disputes.show.url(disputeId));
      })
      .catch(next);
    },

    update(req, res, next) {
      const dispute = res.locals.dispute;

      const { comment } = req.body;

      const ds = new DisputeStatus({
        comment,
        disputeId: dispute.id,
        status: 'Update',
      });

      ds.save()
        .then(() => {
          return DisputeMailer.sendToAdmins({
            dispute,
            disputeStatus: ds,
          });
        })
        .then(() => {
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        })
        .catch(next);
    },

    updateDisputeData(req, res, next) {
      const dispute = res.locals.dispute;

      const commands = ['setForm', 'setDisputeProcess'];

      if (!commands.includes(req.body.command)) {
        return next(new Error('Invalid command'));
      }

      try {
        dispute[req.body.command](req.body);
      } catch (e) {
        req.flash('error', e.toString());
        return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
      }

      return dispute.save()
        .then(() => {
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        })
        .catch(next);
    },

    setSignature(req, res) {
      const dispute = res.locals.dispute;

      dispute.setSignature(req.body.signature)
        .then(() => {
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        })
        .catch((e) => {
          req.flash('error', e.toString());
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        });
    },

    addAttachment(req, res) {
      const dispute = res.locals.dispute;

      if (!req.files.attachment) {
        req.flash('error', 'There is no file to process');
        return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
      }

      return Promise.each(req.files.attachment, (attachment) => {
        return dispute.addAttachment(req.body.name, attachment.path);
      })
      .then(() => {
        return dispute.save();
      })
      .catch(() => {
        req.flash('error', 'A problem occurred trying to process the attachments');
      })
      .finally(() => {
        return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
      });
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          req.flash('The Dispute you started has been deleted.');
          return res.redirect(CONFIG.router.helpers.DisputeTools.index.url());
        })
        .catch(next);
    },
  },
});

module.exports = new DisputesController();
