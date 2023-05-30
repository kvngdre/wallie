import HttpCode from '../utils/httpCodes.utils.js';
import BaseError from './base.error.js';

export default class ServerError extends BaseError {
  constructor(message = 'Something went wrong', data = undefined) {
    super(HttpCode.INTERNAL_SERVER, true, message, data);
  }
}
