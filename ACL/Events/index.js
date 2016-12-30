/* globals User, CollectiveAdmins */
module.exports = {
  Visitor: [
    [false],
    ['index', true],
  ],
  User: [
    ['index', true],
  ],
  CollectiveManager: [
    ['create', 'index', true],
    ['edit', 'update', 'delete', (req) =>
      CollectiveAdmins.query()
        .where({
          collective_id: req.params.collectiveId,
          user_id: req.user.id,
        })
        .then((results) => results.length > 0),
    ],
  ],
  Admin: [
    [true],
  ],
};
