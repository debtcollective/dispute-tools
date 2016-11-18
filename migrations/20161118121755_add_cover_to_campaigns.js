
exports.up = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.string('cover_path');
    t.jsonb('cover_meta').defaultTo('{}');
  });
};

exports.down = (knex) => {
  return knex.schema.table('Campaigns', (t) => {
    t.dropColumn('cover_path');
    t.dropColumn('cover_meta');
  });
};
