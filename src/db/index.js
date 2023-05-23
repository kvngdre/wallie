import { DataTypes, Sequelize } from 'sequelize';
import accountModelGenerator from '../account/account.model.js';
import config from '../config/index.js';
import userModelGenerator from '../user/user.model.js';
import Logger from '../utils/logger.utils.js';

const logger = new Logger();

/**
 * @type {import('./jsdoc/db.types.js').DbObject}
 */
export const db = {
  // Register your model generators in the array.
  modelGenerators: [userModelGenerator, accountModelGenerator],
  models: {},
  Sequelize,
};

connectDatabase();
generateModels();

async function connectDatabase() {
  try {
    const sequelize = new Sequelize({
      database: config.database.name,
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.password,
      dialect: 'mysql',
      define: {
        timestamps: true,
        underscored: true,
      },
      logging: false,
    });

    db.sequelize = sequelize;

    await sequelize.authenticate().then(() => {
      logger.info('Connected to Database.');
    });
  } catch (error) {
    logger.fatal('Failed to connect to Database', error.stack);
    process.exit(1);
  }
}

function generateModels() {
  try {
    if (db.modelGenerators.length == 0) {
      logger.warn('No model generators registered.');
      return;
    }

    // Generating models and appending to models object.
    for (const modelGenerator of db.modelGenerators) {
      const model = modelGenerator(db.sequelize, DataTypes);
      db.models[model.name] = model;
    }

    // Establishing model associations if any
    Object.keys(db.models).forEach((modelName) => {
      if (db.models[modelName].associate) {
        db.models[modelName].associate(db.models);
      }
    });
  } catch (error) {
    logger.fatal(error.message, error.stack);
    process.exit(1);
  }
}
