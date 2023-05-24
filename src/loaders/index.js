import Logger from '../utils/logger.utils.js';
import { initializeApp } from './app.loader.js';
import { connectDatabase } from './db.loader.js';

const logger = new Logger();

export default {
  /** @type {startApp} */
  startApp: async (expressApp = null, appRouter = null) => {
    try {
      initializeApp(expressApp, appRouter);
      await connectDatabase();
    } catch (error) {
      logger.fatal(`Error starting app: ${error.message}`, error.stack);
      process.exit(1);
    }
  },
};
