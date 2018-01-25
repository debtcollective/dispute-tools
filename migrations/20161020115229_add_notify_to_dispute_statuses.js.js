exports.up = knex =>
  knex.schema.table('DisputeStatuses', t => {
    t
      .boolean('notify')
      .notNullable()
      .defaultTo(true);
  });

exports.down = knex =>
  knex.schema.table('DisputeStatuses', t => {
    t.dropColumn('notify');
  });
