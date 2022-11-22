const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const User = require('../models/user.model');
const userValidators = require('../validators/user.validator');

class AuthController {
    async login(userDto) {
        // validating login payload
        const { error } = userValidators.validateLogin(userDto);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        try {
            const { email, password } = userDto;

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

    #formatMsg(errorMsg) {
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        let msg = `${errorMsg.replaceAll('"', '')}.`; // remove quotation marks.
        msg = msg.replace(regex, ','); // add comma to numbers if present in error msg.
        return msg;
    }
}

module.exports = new AuthController();
