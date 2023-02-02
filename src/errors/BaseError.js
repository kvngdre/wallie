class BaseError extends Error {
    constructor(httpCode, isOperational, description) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = httpCode;
        this.isOperational = isOperational;
        this.message = description;

        Error?.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseError;
