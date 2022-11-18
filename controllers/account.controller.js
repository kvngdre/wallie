const Account = require('../models/account.model');
const ServerResponse = require('../utils/serverResponse');
const logger = require('../utils/logger')('authCtrl.js');
const debug = require('debug')('app:authCtrl');
const User = require('../models/user.model');

class AccountController {
    async createAccount(accountDTO) {
        try {
            const foundUser = await User.query().findById(accountDTO.userId);
            if (!foundUser)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            const newAccount = await Account.query().insert({
                userId: foundUser.id,
            });

            return new ServerResponse({
                code: 201,
                msg: 'Account created',
                data: newAccount,
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'create_account',
                message: exception.message,
                meta: exception.stack,
            });
            return exception;
        }
    }
}

module.exports = new AccountController();
