exports.up = knex => knex.schema
  .createTable('AdminsDisputes', t => {
    t.uuid('admin_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.uuid('dispute_id')
      .notNullable()
      .references('id')
      .inTable('Disputes')
      .onDelete('CASCADE');

    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('Posts');
