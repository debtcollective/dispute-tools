/* globals CollectiveBans */
module.exports = {
  Visitor: [
    ['join', false],
    ['index', 'show', true],
  ],
  User: [
    ['index', (req) =>
        User.knex().table('CollectiveBans')
            .where({
                collective_id: req.params.collectiveId,
                user_id: req.user.id
            })
            .then((results) => {
                if (results.length === 0) {
                    return true;
                }

                return false;
            })
    ],
    ['join', (req) =>
        User.knex().table('CollectiveBans')
            .where({
                collective_id: req.post.collectiveId,
                user_id: req.user.id
            })
            .then((results) => {
                if (results.length === 0) {
                    return true;
                }

                return false;
            })
    ],
  ],
};
