
exports.up = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.boolean('published').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.dropColumn('published');
  });
};
