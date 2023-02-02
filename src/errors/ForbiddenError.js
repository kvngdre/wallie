const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./BaseError');

class ForbiddenError extends BaseError {
    constructor(description) {
        const httpCode = httpStatusCodes.FORBIDDEN;
        const isOperational = true;

        super(httpCode, isOperational, description);
    }
}

module.exports = ForbiddenError;
