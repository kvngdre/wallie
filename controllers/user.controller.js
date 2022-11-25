const debug = require('debug')('app:userCtrl');
const logger = require('../utils/logger')('userCtrl.js');
const Response = require('../utils/serverResponse');
const User = require('../models/user.model');
const userValidators = require('../validators/user.validator');

class UserController {
    async createUser(userDto) {
        // validating user data transfer object
        const { error } = userValidators.validateCreate(userDto);
        if (error)
            return new Response(400, this.#formatMsg(error.details[0].message));

        try {
            const newUser = await User.query().insert(userDto);

            return new Response(201, 'User created', newUser);
        } catch (exception) {
            logger.error({
                method: 'create_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            // handling duplicate key error
            if (exception?.nativeError?.errno === 1062)
                return new Response(
                    409,
                    this.#getDuplicateErrorMsg(exception.constraint)
                );

            return new Response(500, 'Something went wrong.');
        }
    }

    async getUsers() {
        try {
            const foundUsers = await User.query();
            if (foundUsers.length === 0)
                return new Response(404, 'Users not found.');

            // modify array inplace to remove passwords from the user objects
            foundUsers.forEach((user) => delete user.password);

            return new Response(200, 'Successful', foundUsers);
        } catch (exception) {
            logger.error({
                method: 'get_users',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async getUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser) return new Response(404, 'User not found.');

            foundUser.omitPassword();

            return new Response(200, 'Successful', foundUser);
        } catch (exception) {
            logger.error({
                method: 'get_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async updateUser(id, userDto) {
        // validating user data transfer object
        const { error, value: dto } = userValidators.validateEdit(userDto);
        if (error)
            return new Response(400, this.#formatMsg(error.details[0].message));

        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser) return new Response(404, 'User not found.');

            const user = await foundUser.$query().patchAndFetch(dto);
            user.omitPassword();

            return new Response(200, 'User updated.', user);
        } catch (exception) {
            logger.error({
                method: 'update_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async deleteUser(id) {
        try {
            const foundUser = await User.query().findById(id);
            if (!foundUser)
                return new Response({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            await foundUser.$query().delete();

            return new Response(204, 'User deleted.');
        } catch (exception) {
            logger.error({
                method: 'delete_user',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
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
