/* globals Dispute, RestfulController, Class, DisputeTool, CONFIG, DisputeStatus,
    DisputeMailer, UserMailer, NotFoundError, DisputeRenderer, Dispute */
const AdmZip = require('adm-zip');
const path = require('path');

const Promise = require('bluebird');
const marked = require('marked');

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
        .include('[user.account, statuses, attachments, disputeTool]')
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

      res.render('disputes/index');
    },

    show(req, res) {
      res.locals.lastStatus = req.dispute.statuses.filter((status) => {
        if (status.status !== 'User Update') {
          return true;
        }
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
        status: 'User Update',
      });

      ds.save()
        .then(() => {
          return DisputeMailer.sendToAdmins({
            dispute,
            user: req.user,
            disputeStatus: ds,
          });
        })
        .then(() => {
          return dispute.save();
        })
        .then(() => {
          return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
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
            req.flash('error', e.toString());
            return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
          },
          json() {
            return res.json({ error: e.toString() });
          },
        });
      }

      return dispute.save()
        .then(() => {
          return res.format({
            html() {
              return res.redirect(CONFIG.router.helpers.Disputes.show.url(dispute.id));
            },
            json() {
              return res.json({ status: 'confirmed' });
            },
          });
        })
        .catch(next);
    },

    setSignature(req, res) {
      const dispute = res.locals.dispute;

      dispute.setSignature(req.body.signature)
        .then((renderer) => {
          return UserMailer.sendDispute(req.user.email, {
            user: req.user,
            renderer,
            _options: {
              subject: 'Dispute Documents - The Debt Collective',
            },
          })
          .then(() => {
            return UserMailer.sendDisputeToAdmin({
              user: req.user,
              renderer,
              _options: {
                subject: 'New Dispute Completed - The Debt Collective',
              },
            });
          });
        })
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
      Promise.all([
        DisputeRenderer.query()
          .where({
            dispute_id: req.params.id,
          })
          .limit(1),
        Dispute.query().where('id', req.params.id),
      ])
        .then(([renderer, [dispute]]) => {
          if (renderer.length === 0) {
            next(new NotFoundError('File not found'));
            return;
          }

          const zipFile = path.join(process.cwd(), 'public', renderer[0].zip.url('original'));
          const zipDest = path.join(process.cwd(), `public/generated_${req.params.id}.zip`);

          const newZip = new AdmZip();

          const info = [];

          // TODO: turn this into an excel doc?
          Object.keys(dispute.data.forms).forEach((form) => {
            info.push(`${form}:\n`);

            Object.keys(dispute.data.forms[form]).forEach((key) => {
              info.push(`- ${key}: ${dispute.data.forms[form][key]}\n`);
            });
          });

          Object.keys(dispute.data).forEach((key) => {
            if (typeof dispute.data[key] === 'string') {
              info.push(`- ${key}: ${dispute.data[key]}\n`);
            }

            if (typeof dispute.data[key] === 'boolean') {
              info.push(`- ${key}: ${dispute.data[key] ? 'yes' : 'no'}\n`);
            }
          });

          newZip.addFile('personal-information.txt', new Buffer(info.join('')));
          newZip.addLocalFile(zipFile);
          newZip.writeZip(zipDest);

          // res.sendFile(zipDest);

          const data = newZip.toBuffer();

          res.setHeader('Content-Length', data.length);
          res.write(data, 'binary');
          res.end();
        });
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          req.flash('warning', 'The Dispute you started has been deleted.');
          return res.redirect(CONFIG.router.helpers.DisputeTools.url());
        })
        .catch(next);
    },
  },
});

module.exports = new DisputesController();
