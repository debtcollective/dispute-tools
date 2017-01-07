
exports.up = (knex) => {
  return knex.schema.createTable('EventAssistants', (t) => {
    t.uuid('id').primary();
    t.boolean('ignore');
    t.uuid('event_id')
      .notNullable()
      .references('id')
      .inTable('Events')
      .onDelete('CASCADE');
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.timestamps();
    t.index('event_id');
    t.index(['event_id', 'user_id'], 'user_going_events');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('EventAssistants');
};
