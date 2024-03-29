import ValidationError from '../errors/validation.error.js';
import HttpCode from '../utils/httpCodes.utils.js';
import SessionService from './session.service.js';
import SessionValidator from './session.validator.js';

class SessionController {
  #sessionService;
  #sessionValidator;

  /**
   * @class SessionController
   * @description A class that handles session-related requests and responses
   * @param {SessionService} sessionService - A service that provides session-related operations.
   * @param {SessionValidator} sessionValidator - A validator that checks session-related inputs.
   */
  constructor(sessionService, sessionValidator) {
    this.#sessionService = sessionService;
    this.#sessionValidator = sessionValidator;
  }

  /** @type {ControllerFunction} */
  login = async (req, res) => {
    const { value, error } = this.#sessionValidator.validateLogin(req.body);
    if (error) {
      throw new ValidationError('Validation Error', error);
    }

    const response = await this.#sessionService.login(value);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction} */
  logout = async (req, res) => {
    const response = await this.#sessionService.logout(req.currentUser.id);

    res.status(HttpCode.NO_CONTENT).json(response);
  };
}

export default SessionController;
