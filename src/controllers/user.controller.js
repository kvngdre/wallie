const {
    validateNewUserDto,
    validateUpdateUserDto,
} = require('../validators/user.validator');
const { httpStatusCodes } = require('../utils/constants');
const formatMsg = require('../utils/formatMsg');
const userService = require('../services/user.service');
const ValidationError = require('../errors/ValidationError');

class UserController {
    static async createUser(req, res) {
        // Validating new user dto
        const { error } = validateNewUserDto(req.body);
        if (error) {
            const errorMsg = formatMsg(error.details[0].message);
            throw new ValidationError(errorMsg);
        }

        const response = await userService.createUser(req.body);
        return res.status(httpStatusCodes.CREATED).json(response);
    }

    static async getUsers(req, res) {
        const response = await userService.getAllUsers();
        return res.status(httpStatusCodes.OK).json(response);
    }

    static async getUser(req, res) {
        const response = await userService.getUser(req.params.id);
        return res.status(httpStatusCodes.OK).json(response);
    }

    static async updateUser(req, res) {
        // validating update user dto
        const { error } = validateUpdateUserDto(req.body);
        if (error) {
            const errorMsg = formatMsg(error.details[0].message);
            throw new ValidationError(errorMsg);
        }

        const response = await userService.updateUser(req.params.id, req.body);
        return res.status(httpStatusCodes.OK).json(response);
    }

    static async deleteUser(req, res) {
        const response = await userService.deleteUser(req.params.id);
        return res.status(httpStatusCodes.OK).json(response);
    }
}

module.exports = UserController;
