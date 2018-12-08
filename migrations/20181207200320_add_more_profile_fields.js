exports.up = knex =>
  knex.schema.table('Users', t => {
    t.string('zip').defaultTo('');
    t.string('state').defaultTo('');
    t.string('phone_number').defaultTo('');
  });

exports.down = knex =>
  knex.schema.table('Users', t => {
    t.dropColumn('zip');
    t.dropColumn('state');
    t.dropColumn('phone_number');
    t.dropColumn('admin');
    t.dropColumn('avatar_url');
  });
