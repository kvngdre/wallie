const BaseError = require('./BaseError');

class APIError extends BaseError {
    constructor(
        name,
        httpCode = 500,
        isOperational = true,
        description = 'Something went wrong'
    ) {
        super(name, httpCode, isOperational, description);
    }
}

module.exports = APIError;
