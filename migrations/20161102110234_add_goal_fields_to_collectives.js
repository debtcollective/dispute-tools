
exports.up = (knex) => {
  return knex.schema.table('Collectives', (t) => {
    t.string('goal_title', 512).defaultTo(null);
    t.text('goal').defaultTo(null);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Collectives', (t) => {
    t.dropColumn('goal_title');
    t.dropColumn('goal');
  });
};
