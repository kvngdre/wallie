import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class DuplicateError extends ApiError {
  constructor(message, data = undefined) {
    super(HttpCode.CONFLICT, true, message, data);
  }
}
