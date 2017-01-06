
exports.up = (knex) => {
  return knex.schema.table('Users', (t) => {
    t.boolean('banned').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table('Users', (t) => {
    t.dropColumn('banned');
  });
};
