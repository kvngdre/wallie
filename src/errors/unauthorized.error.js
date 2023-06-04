import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class UnauthorizedError extends ApiError {
  /**
   * @class Unauthorized Error
   * @param {string} message
   * @param {*} [data]
   */
  constructor(message, data) {
    super(HttpCode.UNAUTHORIZED, message, data);
  }
}
