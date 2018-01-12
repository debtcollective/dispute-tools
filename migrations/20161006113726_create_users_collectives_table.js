exports.up = knex =>
  knex.schema.createTable('UsersCollectives', t => {
    t
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t
      .uuid('collective_id')
      .notNullable()
      .references('id')
      .inTable('Collectives')
      .onDelete('CASCADE');
    t.index(['user_id', 'collective_id'], 'users_collectives');
    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('UsersCollectives');
