import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class UnauthorizedError extends ApiError {
  constructor(message, data = undefined) {
    super(HttpCode.UNAUTHORIZED, true, message, data);
  }
}
