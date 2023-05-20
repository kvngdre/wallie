const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./base.error');

class ValidationError extends BaseError {
  constructor(description) {
    const httpCode = httpStatusCodes.BAD_REQUEST;
    const isOperational = true;

    super(httpCode, isOperational, description);
  }
}

module.exports = ValidationError;
