import ValidationError from '../errors/validation.error.js';
import UserValidator from '../user/user.validator.js';
import formatErrorMsg from '../utils/formatErrorMessage.js';
import HttpCode from '../utils/httpCodes.utils.js';
import UserService from './user.service.js';

const userValidator = new UserValidator();

class UserController {
  #userService;
  #userValidator;

  /**
   *
   * @param {UserService} userService
   * @param {UserValidator} userValidator
   */
  constructor(userService, userValidator) {
    this.#userService = userService;
    this.#userValidator = userValidator;
  }

  signUp = async (req, res) => {
    const { value, error } = this.#userValidator.validateSignUp(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#userService.signUp(value);

    return res.status(HttpCode.CREATED).json(response);
  };

  createUser = async (req, res) => {
    const { error } = this.#userValidator.validateSignUp(req.body);
    if (error) throw new ValidationError('Validation Error', true, error);

    const user = await userService.signUp(req.body);
    const response = new APIResponse('User Created.', user);

    return res.status(HttpCode.CREATED).json(response);
  };

  async getAllUsers(req, res) {
    const { count, foundUsers } = await userService.getUsers();

    function getMessage() {
      if (count == 1) return `${count} user found.`;
      return `${count} users found.`;
    }

    const response = new APIResponse(getMessage(), foundUsers);
    return res.status(HttpCode.OK).json(response);
  }

  async getUser(req, res) {
    const user = await userService.getUser(req.params.id);
    const response = new APIResponse('Fetched user.', user);

    return res.status(HttpCode.OK).json(response);
  }

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
