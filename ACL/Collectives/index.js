/* globals CollectiveBans */
module.exports = {
  Visitor: [
    ['join', false],
    ['index', 'show', true],
  ],
  User: [
    ['index', true],
    // Users shouldn't be blocked from listing collectives,
    // once the user decides join the ban-check will run
    // also, in the index there is not collectiveId
    ['join', (req) => CollectiveBans.query()
      .where({
        collective_id: req.params.id,
        user_id: req.user.id,
      })
      .then((results) => results.length === 0),
    ],
  ],
};
