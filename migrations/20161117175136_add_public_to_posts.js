exports.up = knex =>
  knex.schema.table('Posts', t => {
    t.boolean('public').defaultTo(false);
  });

exports.down = knex =>
  knex.schema.table('Posts', t => {
    t.dropColumn('public');
  });
