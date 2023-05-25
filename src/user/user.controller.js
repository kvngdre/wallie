import ValidationError from '../errors/validation.error.js';
import UserValidator from '../user/user.validator.js';
import formatErrorMsg from '../utils/formatErrorMessage.js';
import HttpCode from '../utils/httpCodes.utils.js';
import UserService from './user.service.js';

class UserController {
  #userService;
  #userValidator;

  /**
   *
   * @param {UserService} userService - User service instance.
   * @param {UserValidator} userValidator - User validator instance
   */
  constructor(userService, userValidator) {
    this.#userService = userService;
    this.#userValidator = userValidator;
  }

  /** @type {ControllerFunction} */
  signUp = async (req, res) => {
    const { value, error } = this.#userValidator.validateSignUp(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.signUp(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction} */
  createUser = async (req, res) => {
    const { value, error } = this.#userValidator.validateCreateUser(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.createUser(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction} */
  getUsers = async (req, res) => {
    const { value, error } = this.#userValidator.validateUserFilter(req.query);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.getUsers(value);

    return res.status(HttpCode.OK).json(response);
  };

  /**
   * @type {ControllerFunction<{userId: string}>}
   */
  getUser = async (req, res) => {
    const response = await this.#userService.getUser(req.params.userId);

    return res.status(HttpCode.OK).json(response);
  };

  async getCurrentUser(req, res) {
    const user = await userService.getUser(req.currentUser.id);
    const response = new APIResponse('Fetched current user.', user);

    return res.status(HttpCode.OK).json(response);
  }

  async updateUser(req, res) {
    const { body, currentUser } = req;

    // validating update user dto
    const { error } = userValidator.validateUpdateUserDto(req.body);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const user = await userService.updateUser(currentUser, body);
    const response = new APIResponse('User updated.', user);

    return res.status(HttpCode.OK).json(response);
  }

  async deleteUser(req, res) {
    await userService.deleteUser(req.currentUser, req.params.id);
    const response = new APIResponse('User deleted.');

    return res.status(HttpCode.OK).json(response);
  }
}

export default UserController;
