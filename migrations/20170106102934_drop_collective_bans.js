const createCollectiveBans = require('./20161218143059_create_collective_bans');

exports.up = knex => knex.schema.dropTable('CollectiveBans');

exports.down = createCollectiveBans.up;
