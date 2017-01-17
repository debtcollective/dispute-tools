/* globals neonode, CONFIG, Class, Admin, RestfulController, Collective, DisputeTool,
NotFoundError, Campaign */

const fs = require('fs-extra');

global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives || {};

Class(Admin.Collectives, 'Campaign').inherits(Campaign)({
  resourceName: 'Admin.Collectives.Campaigns',
});

Class(Admin.Collectives, 'CampaignsController').inherits(RestfulController)({
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
    // selectedCollectiveId
    {
      before(req, res, next) {
        res.locals.selectedCollective = req.params.collective_id;
        next();
      },
      actions: ['new', 'edit', 'update'],
    },
  ],

  prototype: {
    _loadCampaign(req, res, next) {
      Admin.Collectives.Campaign.query()
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
      const campaign = new Admin.Collectives.Campaign(req.body);

      campaign.collectiveId = req.params.collective_id;
      campaign.active = true;

      campaign.save()
        .then(() => {
          if (req.files && req.files.image && req.files.image.length > 0) {
            const image = req.files.image[0];

            return campaign.attach('cover', image.path, {
              fileSize: image.size,
              mimeType: image.mimeType,
            })
            .then(() => {
              fs.unlinkSync(image.path);

              return campaign.save();
            });
          }

          return Promise.resolve();
        })
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
      const published = req.body.published === 'true';

      req.campaign.active = active;
      req.campaign.published = published;

      req.campaign.save()
        .then(() => {
          if (req.files && req.files.image && req.files.image.length > 0) {
            const image = req.files.image[0];

            return req.campaign.attach('cover', image.path, {
              fileSize: image.size,
              mimeType: image.mimeType,
            })
            .then(() => {
              fs.unlinkSync(image.path);

              return req.campaign.save();
            });
          }

          return Promise.resolve();
        })
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

    uploadFiles(req, res) {
      res.end('OK');
    },
  },
});

module.exports = new Admin.Collectives.CampaignsController();
