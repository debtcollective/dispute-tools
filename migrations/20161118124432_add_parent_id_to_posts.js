
exports.up = (knex) => {
  return knex.schema.table('Posts', (t) => {
    t.uuid('parent_id').defaultTo(null);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Posts', (t) => {
    t.dropColumn('parent_id');
  });
};
