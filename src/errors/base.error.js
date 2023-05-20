class BaseError extends Error {
  constructor(httpCode, isOperational = false, message, data = undefined) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = httpCode;
    this.isOperational = isOperational;
    this.data = data;

    Error?.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
