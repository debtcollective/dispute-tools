exports.up = knex =>
  knex.schema.createTable('CollectiveBans', t => {
    t.uuid('id').primary();
    t.boolean('ignore');
    t
      .uuid('collective_id')
      .notNullable()
      .references('id')
      .inTable('Collectives')
      .onDelete('CASCADE');
    t
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.timestamps();
    t.index(['collective_id', 'user_id'], 'collective_banned_users');
  });

exports.down = knex => knex.schema.dropTable('CollectiveBans');
