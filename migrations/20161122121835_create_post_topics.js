
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('Topics', (t) => {
      t.uuid('id').primary();
      t.string('title').notNullable();
      t.timestamps();
    }),
    knex.schema.table('Posts', (t) => {
      t.uuid('topic_id')
        .references('id')
        .inTable('Topics')
        .onDelete('CASCADE');
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('Posts', (t) => {
      t.dropColumn('topic_id');
    }),
    knex.schema.dropTable('Topics'),
  ]);
};
