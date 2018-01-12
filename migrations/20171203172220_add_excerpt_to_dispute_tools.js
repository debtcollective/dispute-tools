exports.up = knex =>
  knex.schema.table('DisputeTools', t => {
    t.text('excerpt');
  });

exports.down = knex =>
  knex.schema.table('DisputeTools', t => {
    t.dropColumn('excerpt');
  });
