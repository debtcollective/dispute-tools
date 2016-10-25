
exports.up = (knex) => {
  return knex.schema.createTable('CollectivesTools', (t) => {
    t.uuid('collective_id')
      .notNullable()
      .references('id')
      .inTable('Collectives')
      .onDelete('CASCADE');
    t.uuid('tool_id')
      .notNullable()
      .references('id')
      .inTable('DisputeTools')
      .onDelete('CASCADE');
    t.index(['collective_id', 'tool_id'], 'collectives_tools');
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('CollectivesTools');
};
