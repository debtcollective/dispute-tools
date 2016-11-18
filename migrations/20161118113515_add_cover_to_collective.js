
exports.up = (knex) => {
  return knex.schema.table('Collectives', (t) => {
    t.string('cover_path');
    t.jsonb('cover_meta').defaultTo('{}');
  });
};

exports.down = (knex) => {
  return knex.schema.table('Collectives', (t) => {
    t.dropColumn('cover_path');
    t.dropColumn('cover_meta');
  });
};
