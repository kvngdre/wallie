const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./BaseError');

class InsufficientFundsError extends BaseError {
    constructor(description) {
        const httpCode = httpStatusCodes.PAYMENT_REQUIRED;
        const isOperational = true;

        super(httpCode, isOperational, description);
    }
}

module.exports = InsufficientFundsError;
