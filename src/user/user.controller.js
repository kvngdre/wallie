import ValidationError from '../errors/validation.error.js';
import UserValidator from '../user/user.validator.js';
import HttpCode from '../utils/httpCodes.utils.js';
import UserService from './user.service.js';

class UserController {
  #userService;
  #userValidator;

  /**
   * @class
   * @param {UserService} userService - User service instance.
   * @param {UserValidator} userValidator - User validator instance
   */
  constructor(userService, userValidator) {
    this.#userService = userService;
    this.#userValidator = userValidator;
  }

  /** @type {ControllerFunction<{}, {}, SignUpDto>} */
  signUp = async (req, res) => {
    const { value, error } = this.#userValidator.validateSignUp(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.signUp(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction<{}, {}, CreateUserDto>} */
  createUser = async (req, res) => {
    const { value, error } = this.#userValidator.validateCreateUser(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.createUser(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction<{}, {}, {}, Omit<UserFilter, 'id'>>} */
  getUsers = async (req, res) => {
    const { value, error } = this.#userValidator.validateUserFilter(req.query);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.getUsers(value);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ userId: string }>} */
  getUser = async (req, res) => {
    const response = await this.#userService.getUser(req.params.userId);

    res.status(HttpCode.OK).json(response);
  };

  async getCurrentUser(req, res) {
    const user = await userService.getUser(req.currentUser.id);
    const response = new APIResponse('Fetched current user.', user);

    res.status(HttpCode.OK).json(response);
  }

  /** @type {ControllerFunction<{ userId: string }>} */
  updateUser = async (req, res) => {
    const { value, error } = this.#userValidator.validateUpdateUser(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.updateUser(
      req.params.userId,
      value,
    );

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ userId: string }>} */
  deleteUser = async (req, res) => {
    const response = await this.#userService.deleteUser(req.params.userId);

    res.status(HttpCode.OK).json(response);
  };
}

export default UserController;
