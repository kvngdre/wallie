const Account = require('../models/account.model');
const debug = require('debug')('app:userCtrl');
const logger = require('../utils/logger')('userCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const User = require('../models/user.model');
const userValidators = require('../validators/user.validator');

class UserController {
    async createUser(userDto) {
        // validating user data transfer object
        const {error} = userValidators.validateCreate(userDto);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        try {
            const newUser = await User.query().insert(userDto);

            return new ServerResponse({
                code: 201,
                msg: 'User created',
                data: newUser,
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'create_user',
                message: exception.message,
                meta: exception.stack,
            });

            // handling duplicate key error
            if (exception?.nativeError?.errno === 1062)
                return new ServerResponse({
                    isError: true,
                    code: 409,
                    msg: this.#getDuplicateErrorMsg(exception.constraint),
                });

            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async getUsers() {
        try {
            const foundUsers = await User.query();
            if (foundUsers.length === 0)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Users not found.',
                });

            // modify array inplace to remove passwords from the user objects
            foundUsers.forEach((user) => delete user.password);

            return new ServerResponse({ data: foundUsers });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_users',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async getUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            foundUser.omitPassword();

            return new ServerResponse({ data: foundUser });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_user',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async updateUser(id, userDto) {
        // validating user data transfer object
        const { error, value: dto } = userValidators.validateEdit(userDto);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            const user = await foundUser.$query().patchAndFetch(dto);
            user.omitPassword();

            return new ServerResponse({
                msg: 'User updated.',
                data: user,
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'update_user',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async deleteUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            await foundUser.$query().delete();

            return new ServerResponse({ code: 204, msg: 'User deleted.' });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'delete_user',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
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

    #formatMsg(errorMsg) {
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        let msg = `${errorMsg.replaceAll('"', '')}.`; // remove quotation marks.
        msg = msg.replace(regex, ','); // add comma to numbers if present in error msg.
        return msg;
    }
}

module.exports = new UserController();
