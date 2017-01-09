
exports.up = (knex) => knex.schema.table('Events', t => {
  t.string('timespan').defaultTo(null);
});

exports.down = (knex) => knex.schema.table('Events', t => {
  t.dropColumn('timespan');
});
