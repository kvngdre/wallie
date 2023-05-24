import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class ForbiddenError extends BaseError {
  constructor(message, isOperational = true, data = undefined) {
    super(HttpCode.FORBIDDEN, isOperational, message, data);
  }
}
