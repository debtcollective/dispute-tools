exports.up = knex =>
  knex.schema.table('Collectives', t => {
    t.string('cover_path');
    t.jsonb('cover_meta').defaultTo('{}');
  });

exports.down = knex =>
  knex.schema.table('Collectives', t => {
    t.dropColumn('cover_path');
    t.dropColumn('cover_meta');
  });
