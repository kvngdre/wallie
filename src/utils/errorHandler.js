const BaseError = require('../errors/BaseError');
const logger = require('../loaders/logger');

class ErrorHandler {
    handleError(error) {
        console.log(error);
        logger.error(error.message, error.stack);
        // send email to admin if critical
        // send to sentry for monitoring
    }

    isTrustedError(error) {
        if (error instanceof BaseError) return error.isOperational;

        return false;
    }
}

module.exports = new ErrorHandler();
