import path from 'path';
import { fileURLToPath } from 'url';
import config from './src/config/index.js';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
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
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
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
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
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
