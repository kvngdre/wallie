const { httpStatusCodes } = require('../utils/constants');
const ErrorHandler = require('../utils/ErrorHandler');

const errorHandler = new ErrorHandler();

module.exports = (err, req, res, next) => {
  errorHandler.handleError(err);

  if (errorHandler.isTrustedError(err)) {
    return res.status(err.code).json({
      success: false,
      errors: {
        message: err.message,
      },
    });
  }

  res.status(httpStatusCodes.INTERNAL_SERVER).json({
    success: false,
    errors: {
      message: 'Something went wrong',
    },
  });
};
