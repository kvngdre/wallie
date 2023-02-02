const BaseError = require('./BaseError');

class APIError extends BaseError {
    constructor(
        httpCode = 500,
        isOperational = true,
        description = 'Something went wrong'
    ) {
        super(httpCode, isOperational, description);
    }
}

module.exports = APIError;
