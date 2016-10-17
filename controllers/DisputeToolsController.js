/* globals RestfulController, DisputeTool, neonode, Class, CONFIG, Dispute */
const marked = require('marked');

const DisputeToolsController = Class('DisputeToolsController')
  .inherits(RestfulController)({
    beforeActions: [
      {
        before: [
          (req, res, next) => {
            return neonode.controllers.Home._authenticate(req, res, next);
          },
          (req, res, next) => {
            DisputeTool.first(req.params.id)
              .then((disputeTool) => {
                res.locals.disputeTool = disputeTool;

                next();
              })
              .catch(next);
          },
        ],
        actions: ['show'],
      },
    ],
    prototype: {
      index(req, res, next) {
        DisputeTool.query()
          .orderBy('id', 'ASC')
          .then((disputeTools) => {
            res.locals.disputeTools = [];

            disputeTools.forEach((dispute) => {
              res.locals.disputeTools.push({
                id: dispute.id,
                name: dispute.name,
                about: marked(dispute.about),
                completed: dispute.completed,
                data: dispute.data,
              });
            });
            res.render('dispute-tools/index');
          })
          .catch(next);
      },

      show(req, res, next) {
        const disputeTool = res.locals.disputeTool;

        let _option;
        Object.keys(disputeTool.data.options).forEach(option => {
          _option = disputeTool.data.options[option];

          if (_option.more) {
            _option.more = marked(_option.more);
          }
        });

        if (Object.keys(disputeTool.data.options).length === 1) {
          return disputeTool.createDispute({
            option: 'none',
            user: req.user,
          })
          .then((disputeId) => {
            return res.redirect(CONFIG.router.helpers.Disputes.show.url(disputeId));
          })
          .catch(next);
        }

        return res.render('dispute-tools/show');
      },
    },
  });

module.exports = new DisputeToolsController();
