const debug = require('debug')('app:userCtrl');
const User = require('../models/user.models');
const logger = require('../utils/logger')('userCtrl.js');

class UserController {
    async createUser(userDTO) {
        try {
            const newUser = await User.query().insert(
                this.#mapToDataModel(userDTO)
            );
            return {
                success: true,
                message: 'User created',
                data: newUser,
            };
        } catch (exception) {
            debug(exception);
            logger.error({
                method: 'create_user',
                message: exception.message,
                meta: exception.stack,
            });
            // duplicate key error
            if (exception?.nativeError?.errno === 1062)
                return this.#getDuplicateErrorMsg(exception.constraint);

            return exception;
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
        return `"${key.charAt(0).toUpperCase().concat(key.slice(1))}" is already in use.`;
    }
}

module.exports = new UserController();
