const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./BaseError');

class UnauthorizedError extends BaseError {
    constructor(description) {
        const httpCode = httpStatusCodes.UNAUTHORIZED;
        const isOperational = true;

        super(httpCode, isOperational, description);
    }
}

module.exports = UnauthorizedError;
