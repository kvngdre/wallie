import './process/process.js';
import 'express-async-errors';
import express from 'express';
import http from 'http';
import config from './config/index.js';
import loader from './loaders/index.js';
import appRoutes from './routes/index.js';
import Logger from './utils/logger.utils.js';

const logger = new Logger();

const app = express();
const port = config.port || 4000;
export const server = http.createServer(app);

async function startServer() {
  try {
    await loader.startApp(app, appRoutes);

    server = app.listen(port, () => {
      logger.info(`Server listening on port: ${port} 🚀`);
    });
  } catch (error) {
    /**@type {Error} */
    const err = error;

    logger.fatal(err.message, err.stack);
  }
}

startServer();
