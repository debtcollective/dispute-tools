exports.up = knex => knex.schema
  .raw(`
  create sequence if not exists readable_id_seq start 105;

  alter table "Disputes"
    add column readable_id BIGINT not null default nextval('readable_id_seq') unique;
  `);

exports.down = knex => knex.schema
  .table('Disputes', d => d.dropColumn('readable_id'))
  .then(() => knex.schema.raw('drop sequence readable_id_seq'));
