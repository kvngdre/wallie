import ValidationError from '../errors/validation.error.js';
import UserValidator from '../user/user.validator.js';
import HttpCode from '../utils/httpCodes.utils.js';
import UserService from './user.service.js';

class UserController {
  #userService;
  #userValidator;

  /**
   * A class that handles user-related requests and responses.
   * @class UserController
   * @param {UserService} userService - An instance of the UserService class that provides user-related business logic.
   * @param {UserValidator} userValidator - An instance of the UserValidator class that validates user input and data.
   */
  constructor(userService, userValidator) {
    this.#userService = userService;
    this.#userValidator = userValidator;
  }

  /** @type {ControllerFunction<{}, {}, SignUpDto>} */
  signUp = async (req, res) => {
    const { value, error } = this.#userValidator.validateSignUp(req.body);
    if (error) throw new ValidationError('Validation Error', error);

    const response = await this.#userService.signUp(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction<{ userId: string, token: string }>} */
  verify = async (req, res) => {
    const response = await this.#userService.verify(
      req.params.userId,
      req.params.token,
    );

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{}, {}, CreateUserDto>} */
  createUser = async (req, res) => {
    const { value, error } = this.#userValidator.validateCreateUser(req.body);
    if (error) throw new ValidationError('Validation Error', error);

    const response = await this.#userService.create(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction<{}, {}, {}, Omit<UserFilter, 'id'>>} */
  getUsers = async (req, res) => {
    const { value, error } = this.#userValidator.validateUserFilter(req.query);
    if (error) throw new ValidationError('Validation Error', error);

    const response = await this.#userService.get(value);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ userId: string }>} */
  getUser = async (req, res) => {
    const response = await this.#userService.show(req.params.userId);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction} */
  async getCurrentUser(req, res) {
    const response = await this.#userService.show(req.currentUser.id);

    res.status(HttpCode.OK).json(response);
  }

  /** @type {ControllerFunction<{ userId: string }>} */
  updateUser = async (req, res) => {
    const { value, error } = this.#userValidator.validateUpdateUser(req.body);
    if (error) throw new ValidationError('Validation Error', error);

    const response = await this.#userService.update(req.params.userId, value);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ userId: string }>} */
  deleteUser = async (req, res) => {
    const response = await this.#userService.erase(req.params.userId);

    res.status(HttpCode.OK).json(response);
  };
}

export default UserController;
