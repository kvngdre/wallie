import errorHandler from '../utils/ErrorHandler.js';

process.on('uncaughtException', (error) => {
  console.error(`! Uncaught Exception ${error}`);

  errorHandler.handleError(error);
});

process.on('unhandledRejection', (error) => {
  console.error(`! Unhandled Rejection ${error.message}`);

  errorHandler.handleError(error);
});
