import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class ServerError extends BaseError {
  /**
   * @class Server Error
   * @param {string} [message]
   * @param {*} [data]
   */
  constructor(message = 'Something went wrong', data) {
    super(HttpCode.INTERNAL_SERVER, message, data);
  }
}
