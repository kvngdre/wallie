import Knex from 'knex';
import { Model } from 'objection';
import knexfile from '../../knexfile.js';
import Logger from '../utils/logger.utils.js';

const logger = new Logger();

export async function connectDatabase() {
  try {
    const config = knexfile[process.env.NODE_ENV];
    const knex = Knex(config);

    await knex.raw('SELECT VERSION()');
    Model.knex(knex);

    logger.info('Database Connected!');
  } catch (error) {
    // /**@type {Error} */
    const err = error;
    logger.fatal('Failed to connect to Database', err.stack);
  }
}
