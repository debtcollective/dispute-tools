
exports.up = (knex) => {
  return knex.schema.createTable('Campaigns', (t) => {
    t.uuid('id').primary();
    t.uuid('collective_id')
      .notNullable()
      .references('id')
      .inTable('Collectives')
      .onDelete('CASCADE');
    t.string('title').notNullable();
    t.text('description');
    t.integer('user_count');
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('Camplaings');
};
