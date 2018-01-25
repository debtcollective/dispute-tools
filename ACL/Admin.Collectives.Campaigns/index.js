/* globals Admin */
module.exports = {
  Visitor: [
    ['new', 'create', 'edit', 'update', 'activate', 'deactivate', false],
  ],
  User: [['new', 'create', 'edit', 'update', 'activate', 'deactivate', false]],
  CollectiveManager: [
    ['new', 'create', true],
    [
      'edit',
      'update',
      'activate',
      'deactivate',
      req => {
        Admin.Campaign.query()
          .where('id', req.params.id)
          .then(([campaign]) =>
            Admin.Campaign.knex()
              .table('CollectiveAdmins')
              .where({
                collective_id: campaign.collectiveId,
                user_id: req.user.id,
              }),
          )
          .then(results => {
            if (results.length === 0) {
              return false;
            }

            return true;
          });
      },
    ],
  ],
  Admin: [['new', 'create', 'edit', 'update', 'activate', 'deactivate', true]],
};
