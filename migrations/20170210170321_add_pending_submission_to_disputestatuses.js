exports.up = knex =>
  knex.schema.table('DisputeStatuses', t => {
    t.boolean('pending_submission').defaultTo(null);
  });

exports.down = knex =>
  knex.schema.table('DisputeStatuses', t => {
    t.dropColumn('pending_submission');
  });
