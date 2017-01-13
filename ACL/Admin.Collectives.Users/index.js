/* globals User */
module.exports = {
  Visitor: [
    [false],
  ],
  User: [
    [false],
  ],
  CollectiveManager: [
    ['index', true],
    ['show', 'edit', 'update', (req) => {
      return User.knex().table('CollectiveAdmins')
        .where({
          collective_id: req.params.id,
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
