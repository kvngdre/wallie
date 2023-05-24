import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class NotFoundError extends BaseError {
  constructor(message, isOperational = true, data = undefined) {
    super(HttpCode.NOT_FOUND, isOperational, message, data);
  }
}
