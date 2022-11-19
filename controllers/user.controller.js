const Account = require('../models/account.model');
const debug = require('debug')('app:userCtrl');
const logger = require('../utils/logger')('userCtrl.js');
const User = require('../models/user.model');
const ServerResponse = require('../utils/serverResponse');

class UserController {
    async createUser(userDTO) {
        try {
            const newUser = await User.query().insert(userDTO);
            await Account.query().insert({ userId: newUser.id }); // creates user account.

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
            if (exception?.nativeError?.errno === 1062) {
                const msg = this.#getDuplicateErrorMsg(exception.constraint);
                return new ServerResponse({ isError: true, code: 409, msg });
            }
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

            // modified array inplace to
            // remove the password from the user objects
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
            return new ServerResponse({
                msg: 'successful',
                data: foundUser,
            });
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
        try {
            const updatedUser = await User.query().patchAndFetchById(
                id,
                userDto
            );
            if (!updatedUser)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            updatedUser.omitPassword();
            return new ServerResponse({
                msg: 'User updated',
                data: updatedUser,
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
            const countDeleted = await User.query().deleteById(id);
            if (countDeleted === 0)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found',
                });

            return new ServerResponse({ code: 204, msg: 'User deleted' });
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
        return `${key
            .charAt(0)
            .toUpperCase()
            .concat(key.slice(1))} is already in use.`;
    }
}

module.exports = new UserController();
