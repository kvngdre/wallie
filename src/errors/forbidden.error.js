import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class ForbiddenError extends BaseError {
  constructor(message, data = undefined) {
    super(HttpCode.FORBIDDEN, true, message, data);
  }
}
