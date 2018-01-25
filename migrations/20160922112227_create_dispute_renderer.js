exports.up = knex =>
  knex.schema.createTable('DisputeRenderers', t => {
    t.uuid('id').primary();
    t
      .uuid('dispute_id')
      .notNullable()
      .references('id')
      .inTable('Disputes')
      .onDelete('CASCADE')
      .index();
    t.string('zip_path');
    t.jsonb('zip_meta').defaultTo('{}');
    t.timestamps();
  });

exports.down = knex => knex.schema.dropTable('DisputeRenderers');
