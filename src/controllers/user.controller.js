const {
    validateNewUserDto,
    validateUpdateUserDto,
} = require('../validators/user.validator');
const { httpStatusCodes } = require('../utils/constants');
const APIResponse = require('../utils/APIResponse');
const formatErrorMsg = require('../utils/formatErrorMsg');
const userService = require('../services/user.service');
const ValidationException = require('../errors/ValidationError');

class UserController {
    static async createUser(req, res) {
        // Validating new user dto
        const { error } = validateNewUserDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const user = await userService.createUser(req.body);
        const response = new APIResponse('User Created', user);

        return res.status(httpStatusCodes.CREATED).json(response);
    }

    static async getAllUsers(req, res) {
        const { count, foundUsers } = await userService.getUsers();

        function getMessage() {
            if (count == 1) return `${count} user found.`;
            return `${count} users found.`;
        }

        const response = new APIResponse(getMessage(), foundUsers);
        return res.status(httpStatusCodes.OK).json(response);
    }

    static async getUser(req, res) {
        const user = await userService.getUser(req.params.id);
        const response = new APIResponse('Fetched user', user);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async getCurrentUser(req, res) {
        const user = await userService.getUser(req.currentUser.id);
        const response = new APIResponse('Fetched current user', user);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async updateUser(req, res) {
        const { body, currentUser } = req;

        // validating update user dto
        const { error } = validateUpdateUserDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const user = await userService.updateUser(currentUser, body);
        const response = new APIResponse('User updated', user);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async deleteUser(req, res) {
        await userService.deleteUser(req.currentUser, req.params.id);
        const response = new APIResponse('User deleted');

        return res.status(httpStatusCodes.OK).json(response);
    }
}

module.exports = UserController;
