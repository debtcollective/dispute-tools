exports.up = knex =>
  knex.schema.table('Events', t => {
    t.dropColumn('map');
  });

exports.down = knex =>
  knex.schema.table('Events', t => {
    t.text('map', 'mediumtext').notNullable();
  });
