const { Model } = require('objection');
const { v4 } = require('uuid');
const Account = require('../models/account.model');
const accountValidators = require('../validators/account.validator');
const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

class AccountController {
    async createAccount(accountDto) {
        // validating account data transfer object
        const { error } = accountValidators.validateCreate(accountDto);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        try {
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
                    msg: this.#getDuplicateErrorMsg(exception.constraint),
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
        // validating account data transfer object
        const { error } = accountValidators.validateEdit(accountDto);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        try {
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

            // handling delete restriction error
            if (exception?.nativeError.errno === 1451)
                return new ServerResponse({
                    isError: true,
                    code: 403,
                    msg: 'Cannot delete account with transactions.',
                });

            return new ServerResponse({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async fundAccount(userId, amount) {
        // validating amount
        const { error } = accountValidators.validateAmount(amount);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        // starting transaction
        const trx = await Model.startTransaction();
        try {
            const foundAccount = await Account.query(trx).findOne({ userId });
            if (!foundAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            await foundAccount.$query(trx).increment('balance', amount);

            await Transaction.query(trx).insert({
                accountId: foundAccount.id,
                txnType: 'credit',
                purpose: 'deposit',
                amount,
                reference: v4(),
                balanceBefore: Number(foundAccount.balance),
                balanceAfter: Number(foundAccount.balance) + Number(amount),
            });
            await trx.commit();

            return new ServerResponse({ msg: 'Account credited' });
        } catch (exception) {
            await trx.rollback(); // rollback changes
            debug(exception.message);
            logger.error({
                method: 'fund_account',
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

    async getBalance(userId) {
        try {
            const accountBalance = await Account.query()
                .findOne({ userId })
                .select('id', 'balance');
            if (!accountBalance)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            return new ServerResponse({ data: accountBalance });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_balance',
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

    async debitAccount(userId, amount) {
        // validating amount
        const { error } = accountValidators.validateAmount(amount);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        // starting transaction
        const trx = await Model.startTransaction();
        try {
            const foundAccount = await Account.query(trx).findOne({ userId });
            if (!foundAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            if (foundAccount.balance < amount)
                return new ServerResponse({
                    isError: true,
                    code: 402,
                    msg: 'Insufficient balance.',
                });

            await foundAccount.$query(trx).decrement('balance', amount);

            await Transaction.query(trx).insert({
                accountId: foundAccount.id,
                txnType: 'debit',
                purpose: 'withdrawal',
                amount,
                reference: v4(),
                balanceBefore: Number(foundAccount.balance),
                balanceAfter: Number(foundAccount.balance) - Number(amount),
            });
            await trx.commit();

            return new ServerResponse({ msg: 'Withdrawal successful' });
        } catch (exception) {
            await trx.rollback(); // rollback changes
            debug(exception.message);
            logger.error({
                method: 'debit_account',
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

    async transferFunds(userId, transferFundsDto) {
        // validating amount
        const { error } = accountValidators.validateTransfer(transferFundsDto);
        if (error)
            return new ServerResponse({
                isError: true,
                code: 400,
                msg: this.#formatMsg(error.details[0].message),
            });

        // starting transaction
        const trx = await Model.startTransaction();
        try {
            const { amount, destinationAccountId } = transferFundsDto;

            const foundSourceAccount = await Account.query(trx).findOne({
                userId,
            });
            if (!foundSourceAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Account not found.',
                });

            const foundDestinationAccount = await Account.query(trx).findOne({
                userId: destinationAccountId,
            });
            if (!foundDestinationAccount)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Destination account not found.',
                });

            if (foundSourceAccount.balance < amount)
                return new ServerResponse({
                    isError: true,
                    code: 402,
                    msg: 'Insufficient balance.',
                });

            await foundSourceAccount.$query(trx).decrement('balance', amount);
            await foundDestinationAccount
                .$query(trx)
                .increment('balance', amount);

            await trx('transactions').insert([
                {
                    accountId: foundSourceAccount.id,
                    txnType: 'debit',
                    purpose: 'transfer',
                    amount,
                    reference: v4(),
                    balanceBefore: Number(foundSourceAccount.balance),
                    balanceAfter:
                        Number(foundSourceAccount.balance) - Number(amount),
                },
                {
                    accountId: foundDestinationAccount.id,
                    txnType: 'credit',
                    purpose: 'transfer',
                    amount,
                    reference: v4(),
                    balanceBefore: Number(foundDestinationAccount.balance),
                    balanceAfter:
                        Number(foundDestinationAccount.balance) +
                        Number(amount),
                },
            ]);
            await trx.commit();

            return new ServerResponse({ msg: 'Transfer successful' });
        } catch (exception) {
            await trx.rollback(); // rollback changes
            debug(exception.message);
            logger.error({
                method: 'transfer_funds',
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
        return 'Duplicate '.concat(key);
    }

    #formatMsg(errorMsg) {
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        let msg = `${errorMsg.replaceAll('"', '')}.`; // remove quotation marks.
        msg = msg.replace(regex, ','); // add comma to numbers if present in error msg.
        return msg;
    }
}

module.exports = new AccountController();
