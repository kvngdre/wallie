const path = require('path');
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/src/config');
// require('dotenv').config();
const config = require('./src/config');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: config.db.dev.host,
      port: config.db.dev.port,
      user: config.db.dev.user,
      password: config.db.dev.password,
      database: config.db.dev.name,
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: path.join(__dirname, '/src/db/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.join(__dirname, '/src/db/seeds/'),
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: config.db.test.host,
      port: config.db.test.port,
      user: config.db.test.user,
      password: config.db.test.password,
      database: config.db.test.name,
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: path.join(__dirname, '/src/db/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.join(__dirname, '/src/db/seeds/'),
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: config.db.prod.host,
      port: config.db.prod.port,
      user: config.db.prod.user,
      password: config.db.prod.password,
      database: config.db.prod.name,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, '/src/db/migrations'),
      tableName: 'knex_migrations',
    },
  },
};
