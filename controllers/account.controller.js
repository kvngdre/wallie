const Account = require('../models/account.model');
const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const User = require('../models/user.model');

class AccountController {
    async createAccount(accountDTO) {
        try {
            if (!accountDTO.userId)
                return new ServerResponse({
                    isError: true,
                    code: 400,
                    msg: 'User id is required.',
                });

            // checking if user exists as a user must be mapped to an account
            const foundUser = await User.query().findById(accountDTO.userId);
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

    async updateAccount(id, accountDto) {
        try {
            const updatedAccount = await User.query().patchAndFetchById(
                id,
                accountDto
            );
            if (!updatedAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found.',
                });

            updatedAccount.omitPassword();
            return new ServerResponse({
                msg: 'User updated',
                data: updatedAccount,
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

    async deleteAccount(id) {
        try {
            const countDeleted = await Account.query().deleteById(id);
            if (countDeleted === 0)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'User not found',
                });

            return new ServerResponse({ code: 204, msg: 'Account deleted' });
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

    #getDuplicateErrorMsg(errorMsg) {
        const regex = /(?<=_)\w+(?=_)/;
        const key = errorMsg.match(regex)[0];
        return `Duplicate ${key.charAt(0).toUpperCase().concat(key.slice(1))}.`;
    }
}

module.exports = new AccountController();
