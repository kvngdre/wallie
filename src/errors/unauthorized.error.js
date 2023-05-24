import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class UnauthorizedError extends BaseError {
  constructor(message, isOperational = true, data = undefined) {
    super(HttpCode.UNAUTHORIZED, isOperational, message, data);
  }
}
