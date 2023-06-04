import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class ConflictError extends ApiError {
  /**
   * @class Conflict Error
   * @param {string} message
   * @param {*} [data]
   */
  constructor(message, data) {
    super(HttpCode.CONFLICT, message, data);
  }
}
