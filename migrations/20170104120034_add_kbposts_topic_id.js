
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('KBPosts', (t) => {
      t.uuid('topic_id')
        .references('id')
        .inTable('Topics')
        .onDelete('CASCADE');
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('KBPosts', (t) => {
      t.dropColumn('topic_id');
    }),
  ]);
};
