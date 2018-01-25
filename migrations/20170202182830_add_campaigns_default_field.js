exports.up = knex =>
  knex.schema.table('Campaigns', t => {
    t.boolean('default').defaultTo(false);
  });

exports.down = knex =>
  knex.schema.table('Campaigns', t => {
    t.dropColumn('default');
  });
