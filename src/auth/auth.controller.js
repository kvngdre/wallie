import ValidationError from '../errors/validation.error.js';
import UserService from '../user/user.service.js';
import UserValidator from '../user/user.validator.js';
import formatErrorMsg from '../utils/formatErrorMessage.js';
import HttpCode from '../utils/httpCodes.utils.js';
import AuthService from './auth.service.js';

const userService = new UserService();
const userValidator = new UserValidator();
class AuthController {
  /** @type {ControllerFunction} */
  async login(req, res) {
    // Validating user login dto
    const { error } = userValidator.validateUserLoginDto(req.body);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const user = await AuthService.signIn(req.body);
    const response = new APIResponse('Login Successful.', user);
  }
}

export default AuthController;
