
exports.up = (knex) => {
  return knex.schema.table('Posts', (t) => {
    t.boolean('public').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Posts', (t) => {
    t.dropColumn('public');
  });
};
