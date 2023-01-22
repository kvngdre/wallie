const { httpStatusCodes } = require('../utils/constants');
const BaseError = require('./BaseError');

class NotFoundError extends BaseError {
    constructor(description) {
        const name = 'Not Found Error';
        const httpCode = httpStatusCodes.NOT_FOUND;
        const isOperational = true;

        super(name, httpCode, isOperational, description);
    }
}

module.exports = NotFoundError;
