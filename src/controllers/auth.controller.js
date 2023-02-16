const { httpStatusCodes } = require('../utils/constants');
const { validateUserSignInDto: validateUserLoginDto } = require('../validators/user.validator');
const APIResponse = require('../utils/APIResponse');
const AuthService = require('../services/auth.service');
const formatErrorMsg = require('../utils/formatErrorMsg');
const ValidationException = require('../errors/ValidationError');
class AuthController {
    static async login(req, res) {
        // Validating user login dto
        const { error } = validateUserLoginDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const user = await AuthService.signIn(req.body);
        const response = new APIResponse('Login Successful.', user);

        return res.status(httpStatusCodes.OK).json(response);
    }
}

module.exports = AuthController;
