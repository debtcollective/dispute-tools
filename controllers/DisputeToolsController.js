/* globals Class */
const marked = require('marked');
const Dispute = require('$models/Dispute');
const DisputeTool = require('$models/DisputeTool');
const { BadRequest, NotFoundError } = require('$lib/errors');
const RestfulController = require('$lib/core/controllers/RestfulController');
const config = require('$config/config');

const { authenticate } = require('$services/auth');

const idRegex = /^1{8}-1{4}-[12346]{4}-1{4}-1{12}$/;

const DisputeToolsController = Class('DisputeToolsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [authenticate],
      actions: ['startDispute'],
    },
    {
      before: [
        async (req, res, next) => {
          try {
            const disputeTool = idRegex.test(req.params.id)
              ? await DisputeTool.findById(req.params.id)
              : await DisputeTool.findBySlug(req.params.id);

            if (disputeTool) {
              res.locals.disputeTool = disputeTool;
              next();
            } else {
              // We don't want this error get to Sentry, due bots and crawlers
              // Sentry ignores errors with status < 500
              const err = new NotFoundError();
              err.status = 404;

              throw err;
            }
          } catch (e) {
            next(e);
          }
        },
      ],
      actions: ['show', 'startDispute'],
    },
  ],
  prototype: {
    index(req, res, next) {
      DisputeTool.query()
        .orderBy('id', 'ASC')
        .then(disputeTools => {
          res.locals.disputeTools = new Array(1).fill(null);

          disputeTools.forEach(disputeTool => {
            const slugOrder = ['general-debt-dispute'];

            const index = slugOrder.indexOf(disputeTool.slug);

            res.locals.disputeTools[index] = {
              id: disputeTool.id,
              name: disputeTool.name,
              excerpt: disputeTool.excerpt,
              about: marked(disputeTool.about),
              completed: disputeTool.completed,
              data: disputeTool.data,
              slug: disputeTool.slug,
            };
          });

          res.render('dispute-tools/index');
        })
        .catch(next);
    },

    show(req, res) {
      const disputeTool = res.locals.disputeTool;

      Object.keys(disputeTool.data.options).forEach(option => {
        const _option = disputeTool.data.options[option];

        if (_option.more) {
          _option.more = marked(_option.more);
        }
      });

      return res.render('dispute-tools/show');
    },

    dtr(req, res) {
      res.render('home/dtr.pug');
    },

    async startDispute(req, res, next) {
      const disputeTool = res.locals.disputeTool;

      if (!req.query.option) {
        return next(new BadRequest());
      }

      try {
        const dispute = await Dispute.createFromTool({
          user: req.user,
          disputeToolId: disputeTool.id,
          option: req.query.option,
        });

        res.redirect(config.router.helpers.Disputes.show.url(dispute.id));
      } catch (e) {
        next(e);
      }
    },
  },
});

module.exports = new DisputeToolsController();
