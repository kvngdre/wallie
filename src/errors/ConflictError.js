const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./BaseError');

class ConflictError extends BaseError {
    constructor(description) {
        const httpCode = httpStatusCodes.CONFLICT;
        const isOperational = true;

        super(httpCode, isOperational, description);
    }
}

module.exports = ConflictError;
