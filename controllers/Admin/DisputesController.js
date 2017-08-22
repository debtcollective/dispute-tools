/* globals neonode, Class, Admin, RestfulController, DisputeTool, CONFIG, Dispute,
 DisputeMailer, DisputeStatus */
const path = require('path');
const Promise = require('bluebird');

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

global.Admin = global.Admin || {};

Admin.DisputesController = Class(Admin, 'DisputesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [
        (req, res, next) => {
          return neonode.controllers.Home._authenticate(req, res, next);
        },
      ],
      actions: ['index', 'show', 'edit', 'update', 'destroy'],
    },
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
        const query = Dispute.query();

        Promise.coroutine(function* restfulAPI() {
          const disputeIds = yield Dispute.search(req.query);

          query.whereIn('id', disputeIds);
        })().then(() => {
          RESTfulAPI.createMiddleware({
            queryBuilder: query
              .where('deleted', false)
              .include('[user.account, attachments, disputeTool]'),
            filters: {
              allowedFields: [
                'dispute_tool_id',
              ],
            },
            order: {
              default: '-updated_at',
              allowedFields: [
                'created_at',
                'updated_at',
              ],
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
    {
      before(req, res, next) {
        Promise.mapSeries(res.locals.results, (result) => {
          return DisputeStatus.query()
            .where({
              dispute_id: result.id,
            })
            .orderBy('created_at', 'DESC')
            .then((statuses) => {
              result.statuses = statuses;
              return Promise.resolve();
            });
        })
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
      res.locals.headers = {
        total_count: ~~res._headers.total_count,
        total_pages: ~~res._headers.total_pages,
        current_page: ~~req.query.page || 1,
        query: req.query,
      };

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

      const { comment, status, note, notify } = req.body;

      const ds = new DisputeStatus({
        comment,
        status,
        note,
        disputeId: dispute.id,
      });

      if (!notify) {
        ds.notify = false;
      }

      ds.save()
        .then(() => {
          if (!ds.notify) {
            return Promise.resolve();
          }

          return DisputeMailer.sendStatusToUser({
            dispute,
            disputeStatus: ds,
          })
          .catch(e => {
            console.log('  ---> Failed to send mail to user (on #update)');
            console.log(e.stack);
          });
        })
        .then(() => {
          return dispute.save();
        })
        .then(() => {
          req.flash('success', 'The dispute status has been updated.');
          return res.redirect(CONFIG.router.helpers.Admin.Disputes.url());
        })
        .catch(next);
    },

    destroy(req, res, next) {
      res.locals.dispute
        .destroy()
        .then(() => {
          req.flash('warning', 'The Dispute has been deleted.');
          return res.redirect(CONFIG.router.helpers.Admin.Disputes.url());
        })
        .catch(next);
    },
  },
});

module.exports = new Admin.DisputesController();
