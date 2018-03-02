/* globals RestfulController, DisputeTool, Class */
const marked = require('marked');
const requireAuthentication = require('../services/authentication');
const authorizeWhen = require('../services/authorization');

const DisputeToolsController = Class('DisputeToolsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: [
        requireAuthentication,
        authorizeWhen(({ user }) => user !== undefined),
        async (req, res, next) => {
          try {
            const disputeTool = await DisputeTool.findById(req.params.id);
            if (disputeTool) {
              res.locals.disputeTool = disputeTool;
              next();
            } else {
              throw new Error('Not found!');
            }
          } catch (e) {
            next(e);
          }
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

      return res.render('dispute-tools/show');
    },
  },
});

module.exports = new DisputeToolsController();
