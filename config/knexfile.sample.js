// Update with your config settings.
module.exports = {
  client: 'postgresql',
  connection: process.env.DB_CONNECTION_STRING || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_SCHEMA || `debtcollective_${process.env.NODE_ENV || 'development'}`,
  },
  pool: {
    min: process.env.DB_POOL_MIN || 2,
    max: process.env.DB_POOL_MAX || 10,
  },
  migrations: {
    tableName: process.env.DB_MIGRATIONS_TABLE || 'knex_migrations',
  },
};
