import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config/index.js';
import Logger from '../utils/logger.utils.js';

const logger = new Logger();

export async function connectDatabase() {
  try {
    const AppDataSource = new DataSource({
      type: 'mysql',
      host: config.db.host,
      port: config.db.port,
      username: config.db.user,
      password: config.db.password,
      entities: [],
      synchronize: true,
      logging: false,
    });

    await AppDataSource.initialize();

    logger.info('Database Connected!');
  } catch (error) {
    logger.fatal('Failed to connect to Database', error.stack);
  }
}
