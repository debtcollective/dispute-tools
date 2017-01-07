
exports.up = function(knex, Promise) {
  return knex.schema.createTable('Events', (t) => {
    t.uuid('id').primary();
    t.uuid('campaign_id')
      .notNullable()
      .references('id')
      .inTable('Campaigns')
      .onDelete('CASCADE');
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.string('name').notNullable();
    t.dateTime('date').notNullable();
    t.text('map', 'mediumtext').notNullable();
    t.text('location_name', 'mediumtext').notNullable();
    t.text('description', 'mediumtext').notNullable();
    t.jsonb('data').defaultTo('{}');
    t.timestamps();

    t.index('campaign_id');
    t.index(['campaign_id', 'user_id'], 'events_by_user');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Events');
};
