exports.up = knex =>
  knex.schema.createTable('KBPosts', t => {
    t.uuid('id').primary();
    t
      .uuid('collective_id')
      .notNullable()
      .references('id')
      .inTable('Collectives')
      .onDelete('CASCADE');
    t.string('name').notNullable();
    t.jsonb('data').defaultTo('{}');
    t.timestamps();

    t.index('collective_id');
  });

exports.down = knex => knex.schema.dropTable('KBPosts');
