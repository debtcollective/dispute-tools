
exports.up = (knex) => {
  return knex.schema.createTable('Posts', (t) => {
    t.uuid('id').primary();
    t.uuid('campaign_id')
      .notNullable()
      .references('id')
      .inTable('Collectives')
      .onDelete('CASCADE');
    t.string('type').notNullable();
    t.jsonb('data').defaultTo('{}');
    t.timestamps();

    t.index('campaign_id');
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable('Posts');
};
