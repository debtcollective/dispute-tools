
exports.up = (knex) => knex.schema.table('EventAssistants', t => {
  t.dropColumn('ignore');
});

exports.down = (knex) => knex.schema.table('EventAssistants', t => {
  t.boolean('ignore');
});
