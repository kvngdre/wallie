const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./base.error');

class DuplicateError extends BaseError {
  constructor(message) {
    const httpCode = httpStatusCodes.CONFLICT;
    const isOperational = true;

    super(httpCode, isOperational, message);
  }
}

module.exports = DuplicateError;
