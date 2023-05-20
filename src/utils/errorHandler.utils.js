import BaseError from '../errors/base.error.js';
import Logger from './logger.utils.js';

const logger = new Logger();

class ErrorHandler {
  isTrustedError(error) {
    if (error instanceof BaseError) return true;
    return false;
  }

  handleError(error) {
    if (this.isTrustedError(error)) {
      this.#handleTrustedError(error);
    } else {
      this.#handleUntrustedError(error);
    }
  }

  #handleTrustedError(error) {
    if (error.isOperational) return logger.debug(error.message, error.stack);
    return logger.error(error.message, error.stack);
  }

  #handleUntrustedError(error) {
    return logger.fatal(error.message, error.stack);
  }
}

export default ErrorHandler;
