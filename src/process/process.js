import ErrorHandler from '../utils/errorHandler.utils.js';

const errorHandler = new ErrorHandler();

process.on('uncaughtException', (error) => {
  console.error(`! Uncaught Exception ${error.message} = ${error.stack}`);

  errorHandler.handleError(error);
});

process.on('unhandledRejection', (error) => {
  console.error(`! Unhandled Rejection ${error.message} = ${error.stack}`);

  errorHandler.handleError(error);
});
