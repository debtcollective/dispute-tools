
exports.up = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.string('intro_text').defaultTo(null);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.dropColumn('intro_text');
  });
};
