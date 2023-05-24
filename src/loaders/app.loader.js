import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import _ from 'lodash';
import morgan from 'morgan';
import config from '../config/index.js';
import NotFoundError from '../errors/notFound.error.js';
import errorMiddleware from '../middleware/error.middleware.js';
import HttpCode from '../utils/httpCodes.utils.js';

/**
 * @function initializeApp
 * @description A function that loads the express app and router.
 * @summary Loads and configures an express app.
 * @param {import('express').Express} app The express app to load.
 * @param {import('express').Router|getAppRouter} appRouter An express router or a function that returns an express router with the app routes.
 * @throws {Error} If app or appRouter are not provided.
 * @exports initializeApp
 */
export function initializeApp(app, appRouter) {
  const { api } = config;

  if (!app || !appRouter) {
    throw new Error(
      'Error: Application failed to initialize because one or more arguments are missing. Please provide a valid express app and a router function.',
    );
  }

  // Security Middleware
  /**
   * The magic package that prevents frontend developers going nuts.
   * Alternate description: Enable Cross Origin Resource Sharing to all origins by default
   */
  app.use(cors('*'));
  app.use(helmet());

  // Debugging Middleware
  app.use(morgan('dev'));

  // Parse JSON bodies (as sent by API clients)
  app.use(express.json());

  // Health check endpoint useful to get quick info the state of the api.
  app.get('/status', (req, res) => {
    res.status(HttpCode.OK).json({ status: 'OK ✔' });
  });
  // TODO: add info endpoint.

  // Route Registration
  if (_.isFunction(appRouter)) {
    app.use(`/${api.prefix}/${api.version}`, appRouter());
  } else {
    app.use(`/${api.prefix}/${api.version}`, appRouter);
  }

  // Catch and handle 404
  app.use((req, res, next) => {
    const err = new NotFoundError('Resource Not Found');
    next(err);
  });

  // Error handling middleware
  app.use(errorMiddleware);

  /*
   * @todo Add more middleware or configurations as needed.
   * However, the error handling middleware should be the last configuration in order to continue to act as a global error handler.
   */
}
