/* globals Admin, Class, RestfulController, User, NotFoundError,
CONFIG, Collective, Account, DisputeTool, neonode, Campaign, User */

const path = require('path');
const Promise = require('bluebird');

global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives || {};

const RESTfulAPI = require(path.join(process.cwd(), 'lib', 'RESTfulAPI'));

function searchUsers(qs, collectiveId) {
  const applyFilters = ids => {
    const query = User.knex()
      .select('Users.*')
      .from('Users')
      .join('Accounts', 'Users.id', 'Accounts.user_id');

    if (qs.search && qs.search !== '') {
      query
        .where('Users.email', 'ilike', `%${qs.search}%`)
        .orWhere('Accounts.fullname', 'ilike', `%${qs.search}%`)
        .orWhere('Accounts.zip', 'ilike', `%${qs.search}%`)
        .orWhere('Accounts.state', 'ilike', `%${qs.search}%`);
    }

    return query
      .whereIn('Users.id', ids)
      .then(results => results.map(x => x.id));
  };

  const getCollectiveUsers = () =>
    Collective.knex()
      .select('UsersCollectives.*')
      .from('UsersCollectives')
      .where('UsersCollectives.collective_id', collectiveId)
      .join('Users', 'UsersCollectives.user_id', 'Users.id');

  const getCampaignUsers = () =>
    Campaign.knex()
      .select('UsersCampaigns.*')
      .from('UsersCampaigns')
      .where('UsersCampaigns.campaign_id', qs.campaign)
      .join('Users', 'UsersCampaigns.user_id', 'Users.id');

  const getIds = query =>
    query.then(results => applyFilters(results.map(x => x.user_id)));

  if (qs.campaign) {
    return getIds(getCampaignUsers());
  }

  return getIds(getCollectiveUsers());
}

Admin.UsersController = Class(Admin.Collectives, 'UsersController').inherits(
  RestfulController,
)({
  beforeActions: [
    {
      before: [
        (req, res, next) =>
          neonode.controllers.Home._authenticate(req, res, next),
      ],
      actions: ['index'],
    },
    {
      before(req, res, next) {
        const query = User.query();

        Promise.coroutine(function* restfulapi() {
          const userIds = yield searchUsers(
            req.query,
            req.params.collective_id,
          );

          query.whereIn('id', userIds);
        })()
          .then(() => {
            RESTfulAPI.createMiddleware({
              queryBuilder: query.include('[account, debtTypes]'),
              filters: {
                allowedFields: ['role'],
              },
              order: {
                default: '-created_at',
                allowedFields: ['created_at', 'updated_at'],
              },
              paginate: {
                pageSize: 50,
              },
            })(req, res, next);
          })
          .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        return Promise.all(
          res.locals.results.map(result =>
            User.getCampaigns(result.id, req.params.collective_id).then(
              data => {
                result.campaigns = data;
              },
            ),
          ),
        )
          .then(() => next())
          .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        res.locals.users = res.locals.results;

        res.locals.headers = {
          total_count: parseInt(res._headers.total_count, 10),
          total_pages: parseInt(res._headers.total_pages, 10),
          current_page: parseInt(req.query.page || 1, 10),
          query: req.query,
        };

        next();
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        Collective.queryVisible()
          .where('id', req.params.collective_id)
          .then(([collective]) => {
            req.collective = collective;
            res.locals.collective = collective;
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
    {
      before(req, res, next) {
        Campaign.query()
          .where('collective_id', req.params.collective_id)
          .orderBy('created_at', 'ASC')
          .then(campaigns => {
            req.campaigns = campaigns;
            res.locals.campaigns = campaigns;
            next();
          })
          .catch(next);
      },
      actions: ['index'],
    },
  ],

  prototype: {
    index(req, res) {
      res.render('admin/collectives/users/index');
    },
  },
});

module.exports = new Admin.Collectives.UsersController();
