exports.up = knex =>
  knex.schema.createTable('Posts', t => {
    t.uuid('id').primary();
    t
      .uuid('campaign_id')
      .notNullable()
      .references('id')
      .inTable('Campaigns')
      .onDelete('CASCADE');
    t
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.string('type').notNullable();
    t.jsonb('data').defaultTo('{}');
    t.timestamps();

    t.index('campaign_id');
    t.index(['campaign_id', 'user_id'], 'posts_by_user');
  });

exports.down = knex => knex.schema.dropTable('Posts');
