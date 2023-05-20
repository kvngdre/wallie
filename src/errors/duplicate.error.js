import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class DuplicateError extends BaseError {
  constructor(message, data = undefined) {
    super(HttpCode.CONFLICT, true, message, data);
  }
}
