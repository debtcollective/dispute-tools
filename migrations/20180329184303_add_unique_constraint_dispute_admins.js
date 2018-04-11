exports.up = knex =>
  knex.schema.raw(
    'alter table "AdminsDisputes" add constraint dispute_id_admin_id_unique_constraint unique (admin_id, dispute_id)',
  );

exports.down = knex =>
  knex.schema.raw(
    'alter table "AdminsDisputes" drop constraint dispute_id_admin_id_unique_constraint',
  );
