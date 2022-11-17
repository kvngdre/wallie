const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const User = require('../models/user.model');
const ServerError = require('../errors/server.error');

class AuthController {
    async login({ email, password }) {
        try {
            const foundUser = await User.query().findOne({ email });
            if(!foundUser) return new ServerError(401, 'Invalid credentials');
            
            const isMatch = await foundUser.isValidPassword(password);
            if(!isMatch) return new ServerError(401, 'Invalid credentials');

            foundUser.token = foundUser.generateAccessToken();
            foundUser.omitPassword();

            return {
                success: true,
                message: 'login successful',
                data: foundUser,
            }
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'login',
                message: exception.message,
                meta: exception.stack,
            });
            return new ServerError(500, 'Something went wrong.');
        }
    }
}

module.exports = new AuthController();
