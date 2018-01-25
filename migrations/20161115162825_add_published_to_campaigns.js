exports.up = knex =>
  knex.schema.table('Campaigns', t => {
    t.boolean('published').defaultTo(false);
  });

exports.down = knex =>
  knex.schema.table('Campaigns', t => {
    t.dropColumn('published');
  });
