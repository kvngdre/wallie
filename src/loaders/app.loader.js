import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config/index.js';
import NotFoundError from '../errors/notFound.error.js';
import errorMiddleware from '../middleware/error.middleware.js';

const { api } = config;

/**
 * @function initializeApp
 * @description A function that loads the express app and applies the app routes.
 * @summary Loads and configures an express app.
 * @param {import('express').Application} app The express app to load.
 * @param {import('./jsdoc/getAppRoutes.js').getAppRoutes} getAppRoutes A function that returns an express router with the app routes.
 * @throws {Error} If app or getAppRoutes are not provided.
 * @exports initializeApp
 */
export function initializeApp(app, getAppRoutes) {
  if (!app || !getAppRoutes) {
    throw new Error(
      'Application failed to initialize with errors in argument.',
    );
  }

  /**
   * The magic package that prevents frontend developers going nuts\
   * Alternate description: Enable Cross Origin Resource Sharing to all origins by default
   */
  app.use(cors('*'));
  app.use(helmet());
  app.use(morgan('dev'));
  // Parse JSON bodies (as sent by API clients)
  app.use(express.json());

  /**
   * Health check endpoints
   * These are useful to quickly check if api is up and debugging.
   */
  app.get('/status', (req, res) => {
    res.status(200).send('OK ✔');
  });

  app.use(`/${api.prefix}/${api.version}`, getAppRoutes());

  // Catch and handle 404
  app.use((req, res, next) => {
    const err = new NotFoundError('Resource Not Found');
    next(err);
  });

  // Error handling middleware
  app.use(errorMiddleware);

  // @todo Add more middleware or configuration as needed
}
