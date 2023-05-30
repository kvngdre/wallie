import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class NotFoundError extends ApiError {
  constructor(message, data = undefined) {
    super(HttpCode.NOT_FOUND, true, message, data);
  }
}
