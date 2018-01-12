exports.up = knex =>
  knex.schema.createTable('Collectives', t => {
    t.uuid('id').primary();
    t.string('name', 512).notNullable();
    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('Collectives');
