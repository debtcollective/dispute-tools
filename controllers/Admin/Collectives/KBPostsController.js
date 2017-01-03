/* global Class, Admin, Collective, RestfulController */

global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives || {};

const KBPostsController = Class(Admin.Collectives, 'KBPostsController')
.inherits(RestfulController)({
  beforeActions: [
    // {
    //   before(req, res, next) {
    //     Collective.query()
    //       .where('id', req.params.campaign_id)
    //       .include('collective')
    //       .then(([campaign]) => {
    //         req.campaign = campaign;
    //         res.locals.campaign = campaign;
    //         next();
    //       })
    //       .catch(next);
    //   },
    //   actions: ['index', 'new'],
    // },
  ],

  prototype: {
    new(req, res) {
      // res.render('admin/campaigns/kbposts/new');
    },
  },
});

module.exports = new KBPostsController();
