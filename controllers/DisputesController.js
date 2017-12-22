/* globals Dispute, RestfulController, Class, DisputeTool, CONFIG, DisputeStatus,
    DisputeMailer, UserMailer, NotFoundError, DisputeRenderer, Dispute */
const path = require('path');

const Promise = require('bluebird');
const marked = require('marked');
const _ = require('lodash');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));
const Raven = require('raven');

const DisputesController = Class('DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadDispute',
      actions: [
        'show',
        'edit',
        'update',
        'updateSubmission',
        'updateDisputeData',
        'setSignature',
        'download',
        'addAttachment',
        'removeAttachment',
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
            .where('deactivated', false)
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
        .include('[user.account, statuses, attachments, disputeTool]')
        .then(([dispute]) => {
          if (!dispute) {
            next(new NotFoundError());
          } else {
            res.locals.dispute = dispute;
            req.dispute = dispute;

            // sort Dispute Status DESC
            dispute.statuses = dispute.statuses
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const optionData = dispute.disputeTool.data.options[dispute.data.option];
            if (optionData && optionData.more) {
              optionData.more = marked(optionData.more);
            }

            next();
          }
        })
        .catch(next);
    },
    index(req, res) {
      res.locals.disputes = res.locals.results;
      res.render('disputes/index');
    },

    show(req, res) {
      res.locals.lastStatus = req.dispute.statuses.filter((status) => {
        if (status.status !== 'User Update') {
          return true;
        }

        return false;
      })[0];

      if (req.user && req.user.id === req.dispute.userId) {
        res.render('disputes/show');
      } else {
        res.render('disputes/showForVisitor');
      }
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
        .then((disputeId) => res.redirect(CONFIG.router.helpers.Disputes.show.url(disputeId)))
        .catch(next);
    },

    update(req, res, next) {
      const dispute = res.locals.dispute;

      const { comment } = req.body;

      const ds = new DisputeStatus({
        comment,
        disputeId: dispute.id,
        status: 'User Update',
      });

      ds.save()
        .then(() => DisputeMailer.sendToAdmins({
          dispute,
          user: req.user,
          disputeStatus: ds,
        }).catch(e => {
          console.log('  ---> Failed to send mail to admins (on #update)');
          console.log(e.stack);
        }))
        .then(() => dispute.save())
        .then(() => res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id)))
        .catch(next);
    },

    updateSubmission(req, res, next) {
      const dispute = res.locals.dispute;
      const pendingSubmission = req.body.pending_submission === '1';

      dispute.markAsCompleted(pendingSubmission)
        .then((renderer) => UserMailer.sendDispute(req.user.email, {
          user: req.user,
          renderer,
          _options: {
            subject: 'Dispute Documents - The Debt Collective',
          },
        })
          .then(() => UserMailer.sendDisputeToAdmin({
            user: req.user,
            renderer,
            _options: {
              subject: 'New Dispute Completed - The Debt Collective',
            },
          }))
          .catch(e => {
            console.log('  ---> Failed to send smail to user (on #setSignature)');
            console.log(e.stack);
            Raven.captureException(e, { req });
          }))
        .then(() => {
          req.flash('success', 'Your dispute is pending for assistance, thank you!');
          res.redirect(CONFIG.router.helpers.Disputes.show.url(req.params.id));
        })
        .catch(next);
    },

    updateDisputeData(req, res, next) {
      const dispute = res.locals.dispute;

      const commands = ['setForm', 'setDisputeProcess', 'setConfirmFollowUp'];

      if (!commands.includes(req.body.command)) {
        return next(new Error('Invalid command'));
      }

      try {
        dispute[req.body.command](req.body);
      } catch (e) {
        return res.format({
          html() {
            req.flash('error', `${e.toString()} (on #${req.body.command})`);
            return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
          },
          json() {
            return res.json({ error: e.toString() });
          },
        });
      }

      return dispute.save()
        .then(() => res.format({
          html() {
            return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
          },
          json() {
            return res.json({ status: 'confirmed' });
          },
        }))
        .catch(next);
    },

    setSignature(req, res) {
      const dispute = res.locals.dispute;

      dispute.setSignature(req.body.signature)
        .then(() => res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id)))
        .catch((e) => {
          req.flash('error', `${e.toString()} (on #setSignature)`);
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        });
    },

    addAttachment(req, res) {
      const dispute = res.locals.dispute;

      if (!req.files.attachment) {
        req.flash('error', 'There is no file to process');
        return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
      }

      return Promise.each(req.files.attachment, (attachment) =>
        dispute.addAttachment(req.body.name, attachment.path))
        .then(() => dispute.save())
        .catch(() => {
          req.flash('error', 'A problem occurred trying to process the attachments');
        })
        .finally(() => {
          req.flash('success', 'Attachment successfully added!');
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        });
    },

    removeAttachment(req, res) {
      const dispute = res.locals.dispute;

      if (!req.params.attachment_id) {
        req.flash('error', 'Missing attachment id');
        return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
      }

      return dispute.removeAttachment(req.params.attachment_id)
        .then(() => {
          req.flash('success', 'Attachment removed');
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        })
        .catch((err) => {
          req.flash('error', err.message);
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
        });
    },

    download(req, res, next) {
      const { dispute } = res.locals;

      const getUrl = renderer => {
        if (Array.isArray(renderer)) renderer = renderer[0];

        const original = renderer.zip.url('original');

        if (!original) {
          return next(new NotFoundError('File is corrupted'));
        }

        return res.redirect(original);
      };

      /**
       * True if {@param renderer} is <code>undefined</code>, if the current status
       * is <code>'Incomplete'</code>; false otherwise as the dispute, upon being
       * moved to the <code>'Completed'</code> status, will immediately trigger its
       * own rendering (so if its <code>'Completed'</code> then the most recent render
       * will always have occurred after the status changed to <code>'Completed'</code>).
       *
       * @param {any|undefined} renderer The most recent render
       * @return {boolean}
       */
      const shouldRender = renderer => {
        if (!renderer) {
          return true;
        }

        const currentStatus = _.sortBy(dispute.statuses, 'updatedAt').slice(-1)[0];

        return currentStatus.status !== 'Completed' || currentStatus.updatedAt > renderer.updatedAt;
      };

      DisputeRenderer.query()
        .where({
          dispute_id: dispute.id,
        })
        .orderBy('updated_at', 'desc')
        .limit(1)
        .then(([renderer]) => {
          if (shouldRender(renderer)) {
            const newRenderer = new DisputeRenderer({
              disputeId: dispute.id,
            });

            return newRenderer.save()
              .catch(next)
              .then(() => newRenderer.render(dispute)
                .then(() => DisputeRenderer.query()
                  .where({ id: newRenderer.id })
                  .include('attachments')
                  .then(([_disputeRenderer]) =>
                    newRenderer.buildZip(_disputeRenderer)
                      .catch(next)
                      .then(id => DisputeRenderer.query()
                        .where({ id })
                        .limit(1)
                        .orderBy('updated_at', 'desc')
                        .then(getUrl))))
              );
          }

          return getUrl(renderer);
        });
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          req.flash('warning', 'The Dispute you started has been deactivated.');
          return res.redirect(CONFIG.router.helpers.DisputeTools.url());
        })
        .catch(next);
    },
  },
});

module.exports = new DisputesController();
