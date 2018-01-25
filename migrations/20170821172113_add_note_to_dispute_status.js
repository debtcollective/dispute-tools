exports.up = knex =>
  knex.schema.table('DisputeStatuses', t => {
    t.text('note');
  });

exports.down = knex =>
  knex.schema.table('DisputeStatuses', t => {
    t.dropColumn('note');
  });
