/* globals neonode, CONFIG, Class, Admin, RestfulController, Collective, DisputeTool,
NotFoundError, Campaign */

global.Admin = global.Admin || {};

Class(Admin, 'Campaign').inherits(Campaign)({
  resourceName: 'Admin.Campaigns',
});

Class(Admin, 'CampaignsController').inherits(RestfulController)({
  beforeActions: [
    // Authenticate
    {
      before(req, res, next) {
        return neonode.controllers.Home._authenticate(req, res, next);
      },
      actions: ['new', 'create', 'edit', 'update', 'activate', 'deactivate'],
    },
    // Load Campaign
    {
      before: '_loadCampaign',
      actions: ['edit', 'update', 'activate', 'deactivate'],
    },
    // Load Collectives
    {
      before(req, res, next) {
        Admin.Collective.query()
          .then((collectives) => {
            return req.restifyACL(collectives);
          })
          .then((collectives) => {
            req.collectives = collectives;
            res.locals.collectives = collectives;

            return next();
          })
          .catch(next);
      },
      actions: ['new', 'create', 'edit', 'update'],
    },
  ],

  prototype: {
    _loadCampaign(req, res, next) {
      Admin.Campaign.query()
        .where('id', req.params.id)
        .include('collective')
        .then((campaign) => {
          if (campaign.length === 0) {
            return next(new NotFoundError('Campaign not found'));
          }

          req.campaign = campaign[0];
          res.locals.campaign = campaign[0];
          return next();
        })
        .catch(next);
    },

    new(req, res) {
      res.render('admin/campaigns/new');
    },

    create(req, res) {
      const campaign = new Admin.Campaign(req.body);

      campaign.active = false;

      campaign.save()
        .then(() => {
          req.flash('success', 'The campaign has been created.');
          res.redirect(
            `${CONFIG.router.helpers.Collectives.show.url(campaign.collectiveId)}#campaigns`
          );
        })
        .catch((err) => {
          res.status(400);

          res.locals.errors = err.errors || err;

          res.render('admin/campaigns/new');
        });
    },

    edit(req, res) {
      res.render('admin/campaigns/edit');
    },

    update(req, res) {
      req.campaign.updateAttributes(req.body);

      const active = req.body.active === 'true';

      req.campaign.active = active;

      req.campaign.save()
        .then(() => {
          req.flash('success', 'The campaign has been updated.');
          res.redirect(
            `${CONFIG.router.helpers.Collectives.show.url(req.campaign.collectiveId)}#campaigns`
          );
        })
        .catch((err) => {
          res.status(400);

          res.locals.errors = err.errors || err;

          res.render('admin/campaigns/edit');
        });
    },

    activate(req, res, next) {
      req.campaign.active = true;

      req.campaign.save()
        .then(() => {
          req.flash('success', 'The campaign is now active.');
          res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.campaign.id));
        })
        .catch(next);
    },

    deactivate(req, res, next) {
      req.campaign.active = false;

      req.campaign.save()
        .then(() => {
          req.flash('success', 'The campaign is now inactive.');
          res.redirect(CONFIG.router.helpers.Campaigns.show.url(req.campaign.id));
        })
        .catch(next);
    },
  },
});

module.exports = new Admin.CampaignsController();
