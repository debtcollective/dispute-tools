exports.up = knex =>
  knex.schema.createTable('CollectiveAdmins', t => {
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
    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('CollectiveAdmins');
