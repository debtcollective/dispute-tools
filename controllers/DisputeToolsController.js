/* globals RestfulController, DisputeTool, neonode, Class, CONFIG, Dispute */
const marked = require('marked');

const DisputeToolsController = Class('DisputeToolsController').inherits(
  RestfulController
)({
  beforeActions: [
    {
      before: [
        (req, res, next) => neonode.controllers.Home._authenticate(req, res, next),
        (req, res, next) => {
          DisputeTool.query()
            .where({
              id: req.params.id,
            })
            .then(([disputeTool]) => {
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
        .then(disputeTools => {
          res.locals.disputeTools = [];

          disputeTools.forEach(disputeTool => {
            res.locals.disputeTools.push({
              id: disputeTool.id,
              name: disputeTool.name,
              excerpt: disputeTool.excerpt,
              about: marked(disputeTool.about),
              completed: disputeTool.completed,
              data: disputeTool.data,
            });
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

      // In case the DisputeTool has just one option ('none')
      // render the show-no-options view
      if (Object.keys(disputeTool.data.options).length === 1) {
        return res.render('dispute-tools/show-optionless');
      }

      return res.render('dispute-tools/show');
    },
  },
});

module.exports = new DisputeToolsController();
