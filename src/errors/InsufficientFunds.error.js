import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class InsufficientFundsError extends ApiError {
  /**
   * @class Insufficient Funds Error
   * @param {string} message
   * @param {*} [data]
   */ constructor(message, data) {
    super(HttpCode.PAYMENT_REQUIRED, message, data);
  }
}
