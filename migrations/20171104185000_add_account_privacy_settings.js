exports.up = knex => knex.schema.table('Accounts', a => {
  a.boolean('private').defaultTo(false);
  a.boolean('disputes_private').defaultTo(false);
});

exports.down = knex => knex.schema.table('Accounts', a => {
  a.dropColumn('private');
  a.dropColumn('disputes_private');
});
