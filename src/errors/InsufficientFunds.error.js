import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class InsufficientFundsError extends ApiError {
  constructor(message, data = undefined) {
    super(HttpCode.PAYMENT_REQUIRED, true, message, data);
  }
}
