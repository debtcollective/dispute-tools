
exports.up = (knex) => {
  return knex.schema.table('DisputeStatuses', (t) => {
    t.boolean('notify')
      .notNullable()
      .defaultTo(true);
  });
};

exports.down = (knex) => {
  return knex.schema.table('DisputeStatuses', (t) => {
    t.dropColumn('notify');
  });
};
