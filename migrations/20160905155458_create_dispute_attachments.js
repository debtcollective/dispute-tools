
exports.up = (knex) => {
  return knex.schema.createTable('DisputeAttachments', (t) => {
    t.uuid('id').primary();
    t.uuid('dispute_id')
      .notNullable()
      .references('id')
      .inTable('Disputes')
      .onDelete('CASCADE')
      .index();
    t.string('file_path');
    t.jsonb('file_meta').defaultTo('{}');
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('DisputeAttachments');
};
