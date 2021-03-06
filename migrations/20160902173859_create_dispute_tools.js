exports.up = knex =>
  knex.schema.createTable('DisputeTools', t => {
    t.uuid('id').primary();
    t.string('name', 256).notNullable();
    t.text('about');
    t.integer('completed').defaultTo(0);
    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('DisputeTools');
