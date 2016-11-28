
exports.up = (knex) => {
  return knex.schema.createTable('UsersCampaigns', (t) => {
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    t.uuid('campaign_id')
      .notNullable()
      .references('id')
      .inTable('Campaigns')
      .onDelete('CASCADE');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('UsersCampaigns');
};
