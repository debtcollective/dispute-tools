
exports.up = (knex) => {
  return knex.schema.createTable('DisputeStatuses', (t) => {
    t.uuid('id').primary();
    t.uuid('dispute_id')
      .notNullable()
      .references('id')
      .inTable('Disputes')
      .onDelete('CASCADE')
      .index();
    t.string('status').notNullable();
    t.text('comment');
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('DisputeStatuses');
};
