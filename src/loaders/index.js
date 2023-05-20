const dbLoader = require('./db.loader');
const errorHandler = require('../utils/ErrorHandler');
const expressLoader = require('./express.loader');
const logger = require('../utils/logger.utils');
import { connectDatabase } from './db.loader';

module.exports = async (app) => {
  await connectDatabase();

  expressLoader(app);
  logger.info('Express loaded 🚀');
};
