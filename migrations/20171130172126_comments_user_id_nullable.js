exports.up = knex => knex.schema
    // so we can keep posts that were made by to-be-deleted users
    .raw(`ALTER TABLE "Posts" ALTER COLUMN user_id DROP NOT NULL`);

exports.down = knex => knex.schema
    .raw(`ALTER TABLE "Posts" ALTER COLUMN user_id SET NOT NULL`);
