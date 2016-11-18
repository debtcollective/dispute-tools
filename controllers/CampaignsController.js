/* global Class, CONFIG, RestfulController, Campaign, NotFoundError */

const CampaignsController = Class('CampaignsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCampaign',
      actions: ['show'],
    },
  ],

  prototype: {
    _loadCampaign(req, res, next) {
      Campaign.query()
        .where('id', req.params.id)
        .include('collective')
        .then((campaign) => {
          if (campaign.length === 0) {
            return next(new NotFoundError('Campaign not found.'));
          }

          req.campaign = campaign[0];
          res.locals.campaign = campaign[0];

          return next();
        })
        .catch(next);
    },

    show(req, res) {
      res.render('campaigns/show');
    },
  },
});

module.exports = new CampaignsController();
