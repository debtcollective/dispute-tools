
exports.up = (knex) => {
  return knex.schema.table('DisputeStatuses', (t) => {
    t.text('note');
  });
};

exports.down = (knex) => {
  return knex.schema.table('DisputeStatuses', (t) => {
    t.dropColumn('note');
  });
};
