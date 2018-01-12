exports.up = knex =>
  knex.schema.table('Campaigns', t => {
    t.boolean('active').defaultTo(false);
  });

exports.down = knex =>
  knex.schema.table('Campaigns', t => {
    t.dropColumn('active');
  });
