import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class NotFoundError extends ApiError {
  /**
   * @class Not Found Error
   * @param {string} message
   * @param {*} [data]
   */
  constructor(message, data) {
    super(HttpCode.NOT_FOUND, message, data);
  }
}
