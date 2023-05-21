import ValidationError from '../errors/validation.error.js';
import UserValidator from '../user/user.validator.js';
import APIResponse from '../utils/APIResponse.js';
import formatErrorMsg from '../utils/formatErrorMessage.js';
import HttpCode from '../utils/httpCodes.utils.js';
import AuthService from './auth.service.js';

const userValidator = new UserValidator();
class AuthController {
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