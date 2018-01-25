exports.up = knex =>
  knex.schema.table('Users', t => {
    t.boolean('banned').defaultTo(false);
  });

exports.down = knex =>
  knex.schema.table('Users', t => {
    t.dropColumn('banned');
  });
