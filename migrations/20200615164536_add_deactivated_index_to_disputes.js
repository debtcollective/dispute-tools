exports.up = knex =>
  knex.schema.table('Disputes', t => {
    t.index('deactivated');
  });

exports.down = knex =>
  knex.schema.table('Disputes', t => {
    t.dropIndex('deactivated');
  });
