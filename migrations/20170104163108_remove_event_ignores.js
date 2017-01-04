
exports.up = knex => knex.schema.dropTable('EventIgnores');

exports.down = require('./20161229185448_add_ignores_as_separated_table').up;
