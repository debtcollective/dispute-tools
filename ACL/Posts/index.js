/* globals User */
module.exports = {
  Visitor: [
    [false],
  ],
  User: [
    ['create', true],
    ['edit', 'update', 'delete', (req) => {
      if (req.post.userId !== req.user.id) {
        return false;
      }

      return true;
    }],
  ],
  CollectiveManager: [
    ['create', true],
    ['edit', 'update', 'delete', (req) => {
      return User.knex().table('CollectiveAdmins')
        .where({
          collective_id: req.post.collectiveId,
          user_id: req.user.id,
        })
        .then((results) => {
          if (results.length === 0) {
            return false;
          }

          return true;
        });
    }],
  ],
  Admin: [
    [true],
  ],
};
