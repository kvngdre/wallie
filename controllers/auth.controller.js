const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const User = require('../models/user.model');

class AuthController {
    async login({ email, password }) {
        try {
            const foundUser = await User.query().findOne({ email });
            if (!foundUser)
                return new ServerResponse({
                    isError: true,
                    code: 401,
                    msg: 'Invalid credentials',
                });

            const isValid = await foundUser.isValidPassword(password);
            if (!isValid)
                return new ServerResponse({
                    isError: true,
                    code: 401,
                    msg: 'Invalid credentials',
                });

            foundUser.token = foundUser.generateAccessToken();
            foundUser.omitPassword();

            return new ServerResponse({
                msg: 'Login successful',
                data: foundUser,
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'login',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerResponse({
                isError: true,
                code: 500,
                message: 'Something went wrong',
            });
        }
    }
}

module.exports = new AuthController();
