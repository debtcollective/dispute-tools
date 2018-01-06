exports.up = knex =>
  knex.schema.table('Accounts', t => {
    t.text('city');
    t.float('latitude');
    t.float('longitude');
  });

exports.down = knex =>
  knex.schema.table('Accounts', t => {
    t.dropColumn('city');
    t.dropColumn('latitude');
    t.dropColumn('longitude');
  });
