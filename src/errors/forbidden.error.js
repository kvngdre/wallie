import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class ForbiddenError extends BaseError {
  /**
   * @class Forbidden Error
   * @param {string} message
   * @param {*} [data]
   */
  constructor(message, data) {
    super(HttpCode.FORBIDDEN, message, data);
  }
}
