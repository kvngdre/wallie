const BaseError = require('../errors/BaseError');
const logger = require('./logger');

class ErrorHandler {
    handleError(error) {
        logger.error({ message: error.message, meta: error.stack });
        // send email to admin if critical
        // send to sentry for monitoring
    }

    isTrustedError(error) {
        if (error instanceof BaseError) return error.isOperational;

        return false;
    }
}

module.exports = new ErrorHandler();
