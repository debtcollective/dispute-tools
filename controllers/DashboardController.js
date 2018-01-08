/* globals Class, RestfulController, Dispute, Collective, User, Campaign */

const isEmpty = require('lodash/isEmpty');
const uniqBy = require('lodash/uniqBy');
const moment = require('moment');

const DashboardController = Class('DashboardController').inherits(
  RestfulController
)({
  beforeActions: [
    // Load Collectives
    {
      before(req, res, next) {
        if (!req.user) {
          return next();
        }

        const collectives = req.user.debtTypes;

        Promise.all(collectives.map((c) => {
          const subquery = Campaign.query()
          .count('*')
          .where('published', true)
          .where('collective_id', c.id);

          return subquery.then(([result]) => {
            c.campaignCount = parseInt(result.count, 10);
            return c;
          });
        })).then(() => {
          req.collectives = collectives;
          res.locals.collectives = collectives;

          next();
        })
        .catch(next);
      },
      actions: ['index'],
    },
    // Load UserCampaigns
    {
      before(req, res, next) {
        if (!req.user) {
          return next();
        }

        return User.query()
          .include('[campaigns]')
          .where('id', req.user.id)
          .then(result => {
            const user = result[0];

            req.user_campaigns = user.campaigns;
            res.locals.user_campaigns = user.campaigns;

            next();
          });
      },
      actions: ['index'],
    },
    // Load Campaign suggestions
    {
      before(req, res, next) {
        if (!req.user) {
          return next();
        }

        const collectiveIds = req.collectives.map(collective => collective.id);
        const query = Campaign.query()
          .include('collective')
          .where('published', true)
          .whereIn('collective_id', collectiveIds)
          .orderBy('updated_at', 'DESC');

        if (isEmpty(req.user_campaigns)) {
          // if the user doesn't have campaigns
          // show the newest campaign for each collective he belongs to
          query.then(result => {
            const campaigns = uniqBy(result, 'collectiveId');

            req.collective_campaigns = campaigns;
            res.locals.collective_campaigns = campaigns;

            next();
          });
        } else {
          // if the user has at least one campaign
          // show campaigns from the collectives he belongs to
          // not older than 3 months and that he is not already part of
          const threeMonthsAgo = moment().subtract(3, 'months').toDate();
          const campaignIds = req.user_campaigns.map(campaign => campaign.id);

          query
            .whereNotIn('id', campaignIds)
            .where('updated_at', '>=', threeMonthsAgo)
            .then(result => {
              req.collective_campaigns = result;
              res.locals.collective_campaigns = result;

              next();
            });
        }
      },
      actions: ['index'],
    },
    // Load latest dispute and status
    {
      before(req, res, next) {
        if (!req.user) {
          return next();
        }

        return Dispute.query()
          .include('[disputeTool, statuses]')
          .where('user_id', req.user.id)
          .where('deactivated', false)
          .orderBy('updated_at', 'DESC')
          .limit(1)
          .then(result => {
            const dispute = result[0];

            if (!dispute) {
              return next();
            }

            req.dispute = dispute;
            res.locals.dispute = dispute;

            // Taken from DisputesController.show
            res.locals.latestStatus = req.dispute.statuses.filter((status) => {
              if (status.status !== 'User Update') {
                return true;
              }

              return false;
            })[0];

            return next();
          });
      },
      actions: ['index'],
    },
  ],
  prototype: {
    index(req, res) {
      res.render('dashboard/index');
    },
  },
});

module.exports = new DashboardController();
