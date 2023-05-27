import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class ValidationError extends BaseError {
  constructor({ message, isOperational = true, data = undefined }) {
    super(HttpCode.BAD_REQUEST, isOperational, message, data);
  }
}
