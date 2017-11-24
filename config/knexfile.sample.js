// Update with your config settings.
const pool = {
  min: 2,
  max: 10,
};

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: 'postgres',
      user: 'postgres',
      database: 'debtcollective_test',
    },
    pool,
    migrations: {},
  },
  development: {
    client: 'postgresql',
    connection: {},
    pool,
    migrations: {},
  },
};
