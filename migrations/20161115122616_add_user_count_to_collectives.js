
exports.up = (knex) => {
  return knex.schema.table('Collectives', (t) => {
    t.integer('user_count').defaultTo(0);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Collectives', (t) => {
    t.dropColumn('user_count');
  });
};
