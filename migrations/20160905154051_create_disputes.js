
exports.up = (knex) => {
  return knex.schema.createTable('Disputes', (t) => {
    t.uuid('id').primary();
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
      .index();
    t.uuid('dispute_tool_id')
      .notNullable()
      .references('id')
      .inTable('DisputeTools')
      .onDelete('CASCADE')
      .index();
    t.jsonb('data').defaultTo('{}');
    t.boolean('deleted').defaultTo(false);
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('Disputes');
};
