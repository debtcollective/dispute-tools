exports.up = knex =>
  knex.schema.table('Users', t => {
    t.string('name').defaultTo('');
    t.string('email');
    t.string('username');
    t.boolean('admin').defaultTo(false);
    t.string('avatar_url');
  });

exports.down = knex =>
  knex.schema.table('Users', t => {
    t.dropColumn('name');
    t.dropColumn('email');
    t.dropColumn('username');
    t.dropColumn('admin');
    t.dropColumn('avatar_url');
  });
