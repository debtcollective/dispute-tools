
exports.up = (knex) => {
  return knex.schema.createTable('Collectives', (t) => {
    t.uuid('id').primary();
    t.string('name', 512).notNullable();
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('Collectives');
};
