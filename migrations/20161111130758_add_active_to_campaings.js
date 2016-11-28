
exports.up = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.boolean('active').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.dropColumn('active');
  });
};
