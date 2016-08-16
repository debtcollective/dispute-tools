
exports.up = (knex, Promise) => {
  return knex.schema.table('Users', (t) => {
    t.string('reset_password_token', 512).defaultTo(null);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.table('Users', (t) => {
    t.dropColumn('reset_password_token');
  });
};
