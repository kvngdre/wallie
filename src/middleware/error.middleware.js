import ApiError from '../errors/api.error.js';
import ErrorHandler from '../utils/errorHandler.utils.js';
import HttpCode from '../utils/httpCodes.utils.js';

const errorHandler = new ErrorHandler();

/**
 * @type {ErrorMiddlewareFunction}
 * @description
 */
export default (err, req, res, next) => {
  errorHandler.handleError(err);
  console.log(err);

  return res.status(err.statusCode || HttpCode.INTERNAL_SERVER).json({
    success: false,
    message: getErrorMessage(err),
    // errors: err?.errors ? { ...err.errors } : undefined,
    data: err?.data,
  });
};

/**
 *
 * @param {(Error|ApiError)} error
 * @returns
 */
function getErrorMessage(error) {
  if (
    !error.statusCode ||
    (error.statusCode === HttpCode.INTERNAL_SERVER && !error.isOperational)
  )
    return 'Something went wrong';

  return error.message;
}
