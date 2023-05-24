import BaseError from '../errors/base.error.js';
import ErrorHandler from '../utils/errorHandler.utils.js';
import HttpCode from '../utils/httpCodes.utils.js';

/**
 *
 * @param {(Error|BaseError)} error
 * @returns
 */
function getErrorMessage(error) {
  if (
    (error.statusCode === HttpCode.INTERNAL_SERVER && !error.isOperational) ||
    !error.statusCode
  )
    return 'Something went wrong';

  return error.message;
}

const errorHandler = new ErrorHandler();

export default (err, req, res, next) => {
  errorHandler.handleError(err);

  return res.status(err.statusCode || HttpCode.INTERNAL_SERVER).json({
    success: false,
    message: getErrorMessage(err),
    // errors: err?.errors ? { ...err.errors } : undefined,
    data: err?.data,
  });
};
