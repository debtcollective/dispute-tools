exports.up = knex =>
  knex.schema.table('Disputes', t => {
    t.integer('dispute_thread_id');
    t.index('dispute_thread_id');
  });

exports.down = knex =>
  knex.schema.table('Disputes', t => {
    t.dropColumn('dispute_thread_id');
  });
