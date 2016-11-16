
exports.up = (knex) => {
  return knex.schema.createTable('Posts', (t) => {
    t.uuid('id').primary();
    t.uuid('campaign_id')
      .notNullable()
      .references('id')
      .inTable('Campaign')
      .onDelete('CASCADE');
    t.uuid('user_id')
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
};

exports.down = (knex) => {
  return knex.schema.dropTable('Posts');
};
