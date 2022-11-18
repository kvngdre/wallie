const Account = require('../models/account.model');
const debug = require('debug')('app:userCtrl');
const logger = require('../utils/logger')('userCtrl.js');
const User = require('../models/user.model');
const ServerError = require('../errors/server.error');
const ServerResponse = require('../utils/serverResponse');

class UserController {
    async createUser(userDTO) {
        try {
            const newUser = await User.query().insert(userDTO);

            return {
                success: true,
                message: 'User created',
                data: newUser,
            };
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'create_user',
                message: exception.message,
                meta: exception.stack,
            });
            // duplicate key error
            if (exception?.nativeError?.errno === 1062) {
                const msg = this.#getDuplicateErrorMsg(exception.constraint);
                return new ServerError(409, msg);
            }
            return new ServerError(500, 'Something went wrong.');
        }
    }

    async getUsers() {
        try {
            const foundUsers = await User.query();
            if (foundUsers.length === 0)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    message: 'No users found.',
                });

            // modifying array inplace to remove password from user objects
            foundUsers.forEach((user) => delete user.password);

            return new ServerResponse({
                message: 'successful',
                data: foundUsers,
            });
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
                message: 'Something went wrong.',
            });
        }
    }

    async getUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser) return new ServerError(404, 'User not found');

            return {
                success: true,
                message: 'successful',
                data: foundUser.omitPassword(),
            };
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_user',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerError(500, 'Something went wrong.');
        }
    }

    async updateUser(id, userDTO) {
        try {
            const updatedUser = await User.query().patchAndFetchById(
                id,
                userDTO
            );
            if (!updatedUser) return new ServerError(404, 'User not found');

            return {
                success: true,
                message: 'User updated.',
                data: updatedUser,
            };
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'update_user',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerError(500, 'Something went wrong.');
        }
    }

    async deleteUser(id) {
        try {
            const countDeleted = await User.query().deleteById(id);
            if (countDeleted === 0)
                return new ServerError(404, 'User not found');

            return {
                success: true,
                message: 'User deleted.',
            };
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'delete_user',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerError(500, 'Something went wrong.');
        }
    }

    #mapToDataModel(data) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        };
    }

    #getDuplicateErrorMsg(errorMsg) {
        const regex = /(?<=_)\w+(?=_)/;
        const key = errorMsg.match(regex)[0];
        return `"${key
            .charAt(0)
            .toUpperCase()
            .concat(key.slice(1))}" is already in use.`;
    }
}

module.exports = new UserController();
