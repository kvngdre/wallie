import Knex from 'knex';
import _ from 'lodash';
import { Model } from 'objection';
import knexEnvConfig from '../../knexfile.js';
import Logger from '../utils/logger.utils.js';

/** @type {NodeEnv} */
const env = process.env.NODE_ENV;
const logger = new Logger();

export async function connectDatabase() {
  const knexConfig = knexEnvConfig[env];
  await createDatabase(knexConfig);

  const knex = Knex(knexConfig);

  await knex.raw('SELECT VERSION()');

  Model.knex(knex);

  logger.info('Database Connected!');
}

/**
 * Creates the database if it does not exist.
 * @param {import('knex').Knex.Config} knexConfig - The knex configuration for the database.
 * @returns {Promise<void>} - A promise that resolves when the database is created or rejects with an error.
 */
async function createDatabase(knexConfig) {
  const dbName = knexConfig.connection.database;

  const knex = Knex({
    client: knexConfig.client,
    connection: {
      host: knexConfig.connection.host,
      port: knexConfig.connection.port,
      user: knexConfig.connection.user,
      password: knexConfig.connection.password,
    },
  });

  try {
    await knex.raw(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
  } finally {
    await knex.destroy();
  }
}
