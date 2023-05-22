import path from 'path';
import { fileURLToPath } from 'url';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/src/config/index.js');
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import config from './src/config/index.js';

console.log(config.db);

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
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
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
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
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
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
