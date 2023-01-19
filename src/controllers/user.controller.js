const { validateNewUserDto } = require('../validators/user.validator');
const debug = require('debug')('app:userCtrl');
const formatMsg = require('../utils/formatMsg');
const logger = require('../utils/logger')('userCtrl.js');
const ServerResponse = require('../utils/ServerResponse');
const User = require('../models/user.model');
const userService = require('../services/user.service');

class UserController {
    async createUser(req, res) {
        const userDto = req.body;

        // validating new user dto
        const { error } = validateNewUserDto(userDto);
        if (error) {
            const errorMessage = formatMsg(error.details[0].message);
            return res.status(400).json(new ServerResponse(errorMessage));
        }

        const response = await userService.createUser(userDto);
        return res.status(response.code).json(response);
    }

    async getUsers(req, res) {
        const response = await userService.getAllUsers();
        return res.status(response.code).json(response);
    }

    async getUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser) return new ServerResponse(404, 'User not found.');

            foundUser.omitPassword();

            return new ServerResponse(200, 'Successful', foundUser);
        } catch (exception) {
            logger.error({
                method: 'get_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new ServerResponse(500, 'Something went wrong.');
        }
    }

    async updateUser(id, userDto) {
        // validating user data transfer object
        const { error, value: dto } =
            userValidators.validateUpdateUserDto(userDto);
        if (error)
            return new ServerResponse(
                400,
                this.#formatMsg(error.details[0].message)
            );

        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser) return new ServerResponse(404, 'User not found.');

            const user = await foundUser.$query().patchAndFetch(dto);
            user.omitPassword();

            return new ServerResponse(200, 'User updated.', user);
        } catch (exception) {
            logger.error({
                method: 'update_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new ServerResponse(500, 'Something went wrong.');
        }
    }

    async deleteUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser) return new ServerResponse(404, 'User not found.');

            await foundUser.$query().delete();

            return new ServerResponse(204, 'User deleted.');
        } catch (exception) {
            logger.error({
                method: 'delete_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new ServerResponse(500, 'Something went wrong.');
        }
    }

    #getDuplicateErrorMsg(errorMsg) {
        const regex = /(?<=_)\w+(?=_)/;
        const key = errorMsg.match(regex)[0];
        return key
            .charAt(0)
            .toUpperCase()
            .concat(key.slice(1), ' is already in use.');
    }

    #formatMsg(msg) {
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        msg = `${errorMsg.replaceAll('"', "'")}.`; // remove quotation marks.
        return msg.replace(regex, ','); // add comma to numbers if present in error msg.
    }
}

module.exports = new UserController();
