const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./base.error');

class NotFoundError extends BaseError {
  constructor(description) {
    const httpCode = httpStatusCodes.NOT_FOUND;
    const isOperational = true;

    super(httpCode, isOperational, description);
  }
}

module.exports = NotFoundError;
