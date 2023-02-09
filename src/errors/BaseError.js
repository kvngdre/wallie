class BaseError extends Error {
    constructor(httpCode, isOperational, description) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = httpCode;
        this.isOperational = isOperational;

        Error?.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseError;
