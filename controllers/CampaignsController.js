/* global Class, CONFIG, RestfulController, Campaign, NotFoundError */

const CampaignsController = Class('CampaignsController').inherits(RestfulController)({
  beforeActions: [
    {
      before: '_loadCampaign',
      actions: ['show', 'join'],
    },
    {
      before(req, res, next) {
        const knex = Campaign.knex();

        req.userBelongsToCampaign = false;
        res.locals.userBelongsToCampaign = false;

        if (!req.user) {
          return next();
        }

        return knex.table('UsersCampaigns')
          .where({
            user_id: req.user.id,
            campaign_id: req.params.id,
          })
          .then((result) => {
            if (result.length > 0) {
              req.userBelongsToCampaign = true;
              res.locals.userBelongsToCampaign = true;
            }

            return next();
          })
          .catch(next);
      },
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

    join(req, res, next) {
      const knex = Campaign.knex();

      Campaign.transaction((trx) => {
        knex.table('UsersCampaigns')
          .transacting(trx)
          .insert({
            user_id: req.user.id,
            campaign_id: req.params.id,
          })
          .then(() => {
            req.campaign.userCount++;

            return req.campaign
              .transacting(trx)
              .save();
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then(() => {
        req.flash('success', `You have successfully joined to ${req.campaign.title}`);
        res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.params.id));
      })
      .catch(next);
    },
  },
});

module.exports = new CampaignsController();
