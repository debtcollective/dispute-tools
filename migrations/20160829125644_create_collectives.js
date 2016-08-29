
exports.up = function(knex, Promise) {
  return knex.schema.createTable('Collectives', (t) => {
    t.uuid('id').primary();
    t.string('name', 512).notNullable();
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Collectives');
};
