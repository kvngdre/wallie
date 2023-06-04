import HttpCode from '../utils/httpCodes.utils.js';

class ApiError extends Error {
  /**
   *
   * @param {HttpCode} httpCode
   * @param {string} message
   * @param {*} [data]
   * @param {boolean} [isOperational]
   */
  constructor(httpCode, message, data, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = httpCode;
    this.isOperational = isOperational;
    this.data = data;

    Error?.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
