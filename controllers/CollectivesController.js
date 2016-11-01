/* globals CONFIG, Class, RestfulController, Collective, DisputeTool, */
const marked = require('marked');

const CollectivesController = Class('CollectivesController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCollective',
      actions: [
        'show',
      ],
    },
    {
      before(req, res, next) {
        Collective.query()
          .include('tools')
          .orderBy('created_at', 'DESC')
          .then((collectives) => {
            req.collectives = collectives;
            res.locals.collectives = collectives;
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
  ],
  prototype: {
    _loadCollective(req, res, next) {
      Collective.query()
        .where({ id: req.params.id })
        .include('tools')
        .then(([collective]) => {
          collective.tools.forEach(tool => {
            tool.about = marked(tool.about);
          });

          if (collective.manifest) {
            collective.manifest = marked(collective.manifest);
          }

          res.locals.collective = collective;
          req.collective = collective;

          next();
        })
        .catch(next);
    },

    index(req, res) {
      res.render('collectives/index');
    },

    show(req, res) {
      res.render('collectives/show');
    },
  },
});

module.exports = new CollectivesController();
