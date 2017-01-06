
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('KBTopics', (t) => {
      t.uuid('id').primary();
      t.string('title').notNullable();
      t.timestamps();
    }),
    knex.schema.table('KBPosts', (t) => {
      t.uuid('topic_id')
        .references('id')
        .inTable('KBTopics')
        .onDelete('CASCADE');
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('KBPosts', (t) => {
      t.dropColumn('topic_id');
    }),
    knex.schema.dropTable('KBTopics'),
  ]);
};
