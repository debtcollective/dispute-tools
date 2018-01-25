exports.up = knex =>
  knex.schema.table('Campaigns', t => {
    t.string('intro_text').defaultTo(null);
  });

exports.down = knex =>
  knex.schema.table('Campaigns', t => {
    t.dropColumn('intro_text');
  });
