/* globals User */
module.exports = {
  Visitor: [[false], ['createComment', false], ['index', true]],
  User: [
    ['create', 'createComment', 'votePoll', 'index', true],
    [
      'edit',
      'update',
      'delete',
      req => {
        if (req.post.userId !== req.user.id) {
          return false;
        }

        return true;
      },
    ],
  ],
  CollectiveManager: [
    ['create', 'index', 'createComment', true],
    [
      'edit',
      'update',
      'delete',
      req => {
        if (req.user.role === 'Admin') {
          return true;
        }

        return User.knex()
          .table('Campaigns')
          .select('collective_id')
          .where('id', req.params.campaign_id)
          .then(([result]) =>
            User.knex()
              .table('CollectiveAdmins')
              .where({
                collective_id: result.collective_id,
                user_id: req.user.id,
              })
              .then(results => {
                if (results.length === 0) {
                  return false;
                }

                return true;
              })
              .catch(() => false),
          );
      },
    ],
  ],
  Admin: [['createComment', true], [true]],
};
