/* globals Account */

module.exports = {
  Visitor: [[false], ['activation', 'activate', 'create', 'new', true]],
  User: [
    [false],
    ['activation', true],
    ['edit', 'update', req => req.params.id === req.user.id],
    [
      'show',
      req => {
        if (req.params.id === req.user.id) {
          return true;
        }

        return Account.query()
          .where({ user_id: req.params.id })
          .limit(1)
          .then(([account]) => !account.private);
      },
    ],
  ],
  Admin: [[true]],
};
