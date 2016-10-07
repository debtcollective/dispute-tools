
exports.up = (knex) => {
  return knex.schema.createTable('Attachments', (t) => {
    t.uuid('id').primary();
    t.string('type', 64);
    t.uuid('foreign_key')
      .notNullable();
    t.string('file_path');
    t.jsonb('file_meta').defaultTo('{}');
    t.timestamps();
    t.index(['foreign_key', 'type']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('DisputeAttachments');
};
