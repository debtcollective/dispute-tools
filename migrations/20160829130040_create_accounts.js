
exports.up = function (knex, Promise) {
  return knex.schema.createTable('Accounts', (t) => {
    t.uuid('id').primary();
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.uuid('collective_id')
      .notNullable()
      .index();
    t.string('fullname', 512).notNullable();
    t.text('bio');
    t.string('state', 32);
    t.string('zip', 16);
    t.jsonb('social_links').defaultTo('{}');
    t.string('image_path', 512);
    t.jsonb('image_meta').defaultTo('{}');
    t.timestamps();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Accounts');
};
