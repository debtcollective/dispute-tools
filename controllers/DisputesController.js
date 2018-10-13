/* globals RestfulController, Class */
const Promise = require('bluebird');
const marked = require('marked');
const _ = require('lodash');
const { BadRequest, NotFoundError } = require('$lib/errors');
const DisputeStatuses = require('$shared/enum/DisputeStatuses');
const { CompletedDisputeMessage } = require('$services/messages');
const { Raven, logger } = require('$lib');
const Dispute = require('$models/Dispute');
const DisputeRenderer = require('$models/DisputeRenderer');
const config = require('$config/config');

const {
  authenticate,
  authorize,
  tests: { ownerOrAdmin },
} = require('$services/auth');

const DisputesController = Class('DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [authenticate],
      actions: ['*'],
    },
    {
      before: ['_loadDispute', authorize(ownerOrAdmin)],
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
  ],
  prototype: {
    async _loadDispute(req, res, next) {
      try {
        const dispute = await Dispute.findById(
          req.params.id,
          '[user, statuses, attachments, disputeTool]',
        );

        if (!dispute) {
          next(new NotFoundError());
        } else {
          dispute.statuses = _.orderBy(dispute.statuses, 'createdAt', 'desc');

          // Used in template
          const optionData = dispute.disputeTool.data.options[dispute.data.option];
          if (optionData && optionData.more) {
            optionData.more = marked(optionData.more);
          }

          req.dispute = res.locals.dispute = dispute;
          next();
        }
      } catch (e) {
        next(e);
      }
    },

    async myDisputes(req, res) {
      res.locals.disputes = await Dispute.findByUser(req.user, '[disputeTool, statuses]');
      res.render('disputes/my');
    },

    show(req, res) {
      res.locals.lastStatus = _.last(
        _.sortBy(
          _.filter(req.dispute.statuses, ({ status }) => status !== DisputeStatuses.userUpdate),
          'updatedAt',
        ),
      );

      if (req.user && req.user.id === req.dispute.userId) {
        res.render('disputes/show');
      } else {
        res.render('disputes/showForVisitor');
      }
    },

    async create(req, res, next) {
      if (!(req.body.disputeToolId && req.body.option)) {
        return next(new BadRequest());
      }

      try {
        const dispute = await Dispute.createFromTool({
          user: req.user,
          disputeToolId: req.body.disputeToolId,
          option: req.body.option,
        });

        res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
      } catch (e) {
        next(e);
      }
    },

    async updateSubmission(req, res) {
      const dispute = res.locals.dispute;
      const pendingSubmission = req.body.pending_submission === '1';
      const redirect = () => res.redirect(config.router.helpers.Disputes.show.url(req.params.id));

      try {
        await dispute.markAsCompleted(pendingSubmission);
      } catch (e) {
        // `markAsCompleted` handles logging the exception and sending it to Raven
        // so we just need to tell the user that something went wrong.

        req.flash(
          'error',
          'An error occurred while completing your dispute. Please try again. If the problem persists, contact a Debt Collective organizer for assistance.',
        );
        return redirect();
      }

      try {
        await new CompletedDisputeMessage(dispute).send();
        req.flash(
          'success',
          'Thank you for disputing your debt. A copy of your dispute has been sent to your email.',
        );
      } catch (e) {
        Raven.captureException(e);
        logger.error(e);

        req.flash(
          'error',
          'Your dispute was successfully saved. However, an error was encountered while sending the confirmation email. Please contact a Debt Collective organizer to resolve this error.',
        );
      }

      return redirect();
    },

    async updateDisputeData(req, res, next) {
      const dispute = res.locals.dispute;

      const commands = ['setForm', 'setDisputeProcess'];

      if (!commands.includes(req.body.command)) {
        return next(new BadRequest());
      }

      try {
        const res = dispute[req.body.command](req.body);
        if (typeof res.then === 'function') {
          await res;
        }
      } catch (e) {
        Raven.captureException(e);
        logger.error(
          `Error occurred while updating dispute data for dispute ${dispute.id}`,
          e.message || (e.toString && e.toString()) || e,
        );
        return res.format({
          html() {
            req.flash(
              'error',
              e.errors
                ? `An error ocurred while validating your form data: ${e.errors[0]}`
                : 'An error occurred while updating the dispute data. Please try again or contact a dispute administrator if the problem persists.',
            );
            return res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
          },
          json() {
            return res.json({ error: e.toString() });
          },
        });
      }

      return dispute
        .save()
        .then(() =>
          res.format({
            html() {
              if (req.body.command === 'setForm') {
                req.flash('success', 'Your information was successfully updated');
              }
              return res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
            },
            json() {
              return res.json({ status: 'confirmed', dispute });
            },
          }),
        )
        .catch(next);
    },

    setSignature(req, res, next) {
      const dispute = res.locals.dispute;

      if (!req.body.signature) return next(new BadRequest());

      dispute
        .setSignature(req.body.signature)
        .then(() => res.redirect(config.router.helpers.Disputes.show.url(dispute.id)))
        .catch(e => {
          req.flash('error', `${e.toString()} (on #setSignature)`);
          return res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
        });
    },

    async addAttachment(req, res, next) {
      const dispute = res.locals.dispute;

      if (!req.files || !req.files.attachment) {
        return next(new BadRequest());
      }

      let caught = null;
      try {
        await Promise.each(req.files.attachment, attachment =>
          dispute.addAttachment(req.body.name, attachment.path),
        );
        await dispute.save();
        req.flash('success', 'Attachment successfully saved to your dispute');
      } catch (e) {
        req.flash(
          'error',
          'A problem occurred while attempting to upload your attachments. Please try again, and if the problem persists, contact a Debt Collective organizer.',
        );
        logger.error('Unable to upload attachment', e.message);
        caught = e;
      }

      res.format({
        html() {
          res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
        },
        json() {
          if (caught !== null) {
            res.status(400).json({ error: caught.toString() });
          } else {
            res.status(204).send({});
          }
        },
      });
    },

    removeAttachment(req, res) {
      const dispute = res.locals.dispute;

      if (!req.params.attachment_id) {
        req.flash('error', 'Missing attachment id');
        return res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
      }

      return dispute
        .removeAttachment(req.params.attachment_id)
        .then(() => {
          req.flash('success', 'Attachment removed');
          return res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
        })
        .catch(err => {
          req.flash('error', err.message);
          return res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
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

        if (dispute.updatedAt > renderer.updatedAt) {
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

            return newRenderer
              .save()
              .catch(next)
              .then(() =>
                newRenderer.render(dispute).then(() =>
                  DisputeRenderer.query()
                    .where({ id: newRenderer.id })
                    .include('attachments')
                    .then(([_disputeRenderer]) =>
                      newRenderer
                        .buildZip(_disputeRenderer)
                        .catch(next)
                        .then(id =>
                          DisputeRenderer.query()
                            .where({ id })
                            .limit(1)
                            .orderBy('updated_at', 'desc')
                            .then(getUrl),
                        ),
                    ),
                ),
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
          return res.redirect(config.router.helpers.Disputes.myDisputes.url());
        })
        .catch(next);
    },
  },
});

module.exports = new DisputesController();
