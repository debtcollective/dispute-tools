exports.up = (knex) =>
  Promise.all([
    knex.schema.dropTable('KBPosts'),
    knex.schema.dropTable('KBTopics'),
  ])
  .then(() => knex.schema.createTable('KBPosts', (t) => {
    t.uuid('id').primary();
    t.uuid('campaign_id')
      .notNullable()
      .references('id')
      .inTable('Campaigns')
      .onDelete('CASCADE');
    t.string('name').notNullable();
    t.jsonb('data').defaultTo('{}');
    t.timestamps();
    t.index('campaign_id');
  }))
  .then(() => require('./20170103122900_add_file_fields_to_kbposts').up(knex, Promise))
  .then(() => require('./20170104120034_add_kbposts_topic_id').up(knex, Promise));

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('KBPosts'),
    knex.schema.dropTable('KBTopics'),
  ])
  .then(() => require('./20161218172510_create_collective_knowledge_base').up(knex, Promise))
  .then(() => require('./20170103122900_add_file_fields_to_kbposts').up(knex, Promise))
  .then(() => require('./20170104120034_add_kbposts_topic_id').up(knex, Promise));
