import HttpCode from '../utils/httpCodes.utils.js';
import ApiError from './api.error.js';

export default class ValidationError extends ApiError {
  constructor({ message, data = undefined }) {
    super(HttpCode.BAD_REQUEST, true, message, data);
  }
}
