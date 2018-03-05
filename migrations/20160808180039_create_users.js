exports.up = knex =>
  knex.schema.createTable('Users', t => {
    t.uuid('id').primary();
    t
      .bigInteger('external_id')
      .unique()
      .notNullable();
    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('Users');
