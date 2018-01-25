exports.up = knex =>
  knex.schema.table('Posts', t => {
    t.uuid('parent_id').defaultTo(null);
  });

exports.down = knex =>
  knex.schema.table('Posts', t => {
    t.dropColumn('parent_id');
  });
