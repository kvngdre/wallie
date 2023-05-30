class ApiError extends Error {
  constructor(httpCode, isOperational = true, message, data = undefined) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = httpCode;
    this.isOperational = isOperational;
    this.data = data;

    Error?.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
