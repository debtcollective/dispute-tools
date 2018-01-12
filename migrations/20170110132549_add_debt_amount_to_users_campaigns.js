exports.up = knex =>
  knex.schema.table('UsersCampaigns', t => {
    t.integer('debt_amount').defaultTo(0);
  });

exports.down = knex =>
  knex.schema.table('UsersCampaigns', t => {
    t.dropColumn('debt_amount');
  });
