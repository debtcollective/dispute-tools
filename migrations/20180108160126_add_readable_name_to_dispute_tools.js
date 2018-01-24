
exports.up = (knex) => knex.schema.table('DisputeTools', t => {
  t.string('readable_name');
});

exports.down = (knex) => knex.schema.table('DisputeTools', t => {
  t.dropColumn('readable_name');
});
