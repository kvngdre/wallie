const Account = require('../models/account.model');
const accountValidators = require('../validators/account.validator');
const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const User = require('../models/user.model');

class AccountController {
    async createAccount(accountDto) {
        try {
            // validating account data transfer object
            const { error } = accountValidators.validateCreate(accountDto);
            if (error)
                return new ServerResponse({
                    isError: true,
                    code: 400,
                    msg: this.#formatMsg(error.details[0].message),
                });

            // checking if user exists
            const { userId } = accountDto;
            const foundUser = await User.query().findById(userId);
            if (!foundUser)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            const newAccount = await Account.query().insertAndFetch({
                userId: foundUser.id,
            });

            return new ServerResponse({
                code: 201,
                msg: 'Account created.',
                data: newAccount,
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'create_account',
                message: exception.message,
                meta: exception.stack,
            });
            // handling duplicate key error
            if (exception?.nativeError?.errno === 1062)
                return new ServerResponse({
                    isError: true,
                    code: 409,
                    msg: 'User already has an account.',
                });

            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async getAccounts() {
        try {
            const foundAccounts = await Account.query();
            if (foundAccounts.length === 0)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Accounts not found.',
                });

            return new ServerResponse({ data: foundAccounts });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_accounts',
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

    async getAccount(id) {
        try {
            const foundAccount = await Account.query().findById(id);
            if (!foundAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            return new ServerResponse({ data: foundAccount });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_account',
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

    async updateAccount(id, accountDto) {
        try {
            // validating account data transfer object
            const { error } = accountValidators.validateEdit(accountDto);
            console.log(error.details[0].context);
            if (error)
                return new ServerResponse({
                    isError: true,
                    code: 400,
                    msg: this.#formatMsg(error.details[0].message),
                });

            const foundAccount = await Account.query().findById(id);
            if (!foundAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            const account = await foundAccount
                .$query()
                .patchAndFetch(accountDto);

            return new ServerResponse({
                msg: 'Account updated',
                data: account,
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'update_account',
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

    async deleteAccount(id) {
        try {
            const foundAccount = await Account.query().findById(id);
            if (!foundAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            await foundAccount.$query().delete();

            return new ServerResponse({ code: 204, msg: 'Account deleted' });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'delete_account',
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
        return `Duplicate ${key.charAt(0).toUpperCase().concat(key.slice(1))}.`;
    }

    #formatMsg(errorMsg) {
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        let msg = `${errorMsg.replaceAll('"', '')}.`; // remove quotation marks.
        msg = msg.replace(regex, ','); // add comma to numbers if present in error msg.
        return msg;
    }
}

module.exports = new AccountController();
