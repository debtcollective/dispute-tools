
exports.up = (knex) => {
  return knex.schema.table('KBPosts', (t) => {
    t.string('file_path', 512);
    t.jsonb('file_meta').defaultTo('{}');
  });
};

exports.down = (knex) => {
  return knex.schema.table('KBPosts', (t) => {
    t.dropColumn('file_path');
    t.dropColumn('file_meta');
  });
};
