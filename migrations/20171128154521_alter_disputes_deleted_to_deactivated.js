exports.up = knex =>
  knex.schema.table('Disputes', table => {
    table.renameColumn('deleted', 'deactivated');
  });

exports.down = knex =>
  knex.schema.table('Disputes', table => {
    table.renameColumn('deactivated', 'deleted');
  });
