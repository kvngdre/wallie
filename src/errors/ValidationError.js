const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./BaseError');

class ValidationError extends BaseError {
    constructor(description) {
        const name = 'Validation Error';
        const httpCode = httpStatusCodes.BAD_REQUEST;
        const isOperational = true;

        super(name, httpCode, isOperational, description);
    }
}

module.exports = ValidationError;
