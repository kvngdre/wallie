import ValidationError from '../errors/validation.error.js';
import UserValidator from '../user/user.validator.js';
import APIResponse from '../utils/APIResponse.js';
import formatErrorMsg from '../utils/formatErrorMsg.js';
import HttpCode from '../utils/httpCodes.utils.js';
import userService from './user.service.js';

const userValidator = new UserValidator();

class UserController {
  async createUser(req, res) {
    const { error } = userValidator.validateNewUserDto(req.body);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const user = await userService.createUser(req.body);
    const response = new APIResponse('User Created.', user);

    return res.status(HttpCode.CREATED).json(response);
  }

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
