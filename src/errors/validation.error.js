import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class ValidationError extends ApiError {
  /**
   * @class ValidationError
   * @param {string} message
   * @param {*} [data]
   */
  constructor(message, data) {
    super(HttpCode.BAD_REQUEST, message, data);
  }
}
