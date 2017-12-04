exports.up = knex => {
  return knex.schema.table('DisputeTools', t => {
    t.text('excerpt');
  });
};

exports.down = knex => {
  return knex.schema.table('DisputeTools', t => {
    t.dropColumn('excerpt');
  });
};
