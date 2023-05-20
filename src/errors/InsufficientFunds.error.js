import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class InsufficientFundsError extends BaseError {
  constructor(message, data = undefined) {
    super(HttpCode.PAYMENT_REQUIRED, true, message, data);
  }
}
