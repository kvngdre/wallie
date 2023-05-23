import { Sequelize } from 'sequelize';
import config from '../config/index.js';
import Logger from '../utils/logger.utils.js';

export const db = {};
const logger = new Logger();

try {
  const sequelize = new Sequelize({
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
    },
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  await sequelize.authenticate();

  logger.info('Database Connected!');
} catch (error) {
  logger.fatal('Failed to connect to Database', error.stack);
}
