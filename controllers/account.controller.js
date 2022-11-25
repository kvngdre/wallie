const { Model } = require('objection');
const { v4 } = require('uuid');
const Account = require('../models/account.model');
const accountValidators = require('../validators/account.validator');
const debug = require('debug')('app:authCtrl');
const logger = require('../utils/logger')('authCtrl.js');
const Response = require('../utils/serverResponse');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');

class AccountController {
    async createAccount(accountDto) {
        // validating account data transfer object
        const { error } = accountValidators.validateCreate(accountDto);
        if (error)
            return new Response(400, this.#formatMsg(error.details[0].message));

        try {
            // checking if user exists
            const { userId } = accountDto;
            const foundUser = await User.query().findById(userId);
            if (!foundUser) return new Response(404, 'User not found.');

            const newAccount = await Account.query().insertAndFetch({
                userId: foundUser.id,
            });

            return new Response(201, 'Account created.', newAccount);
        } catch (exception) {
            logger.error({
                method: 'create_account',
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

    async getAccounts() {
        try {
            const foundAccounts = await Account.query();
            if (foundAccounts.length === 0)
                return new Response(404, 'Accounts not found.');

            return new Response(200, 'Successful', foundAccounts);
        } catch (exception) {
            logger.error({
                method: 'get_accounts',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async getAccount(id) {
        try {
            const foundAccount = await Account.query().findById(id);
            if (!foundAccount) return new Response(404, 'Account not found.');

            return new Response(200, 'Successful', foundAccount);
        } catch (exception) {
            logger.error({
                method: 'get_account',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async deleteAccount(id) {
        try {
            const foundAccount = await Account.query().findById(id);
            if (!foundAccount) return new Response(404, 'Account not found.');

            await foundAccount.$query().delete();

            return new Response(204, 'Account deleted');
        } catch (exception) {
            logger.error({
                method: 'delete_account',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async getBalance(userId) {
        try {
            const accountBalance = await Account.query()
                .findOne({ userId })
                .select('id', 'balance');
            if (!accountBalance) return new Response(404, 'Account not found.');

            return new Response(200, 'Successful', accountBalance);
        } catch (exception) {
            logger.error({
                method: 'get_balance',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async fundAccount(userId, amount) {
        // validating amount
        const { error } = accountValidators.validateAmount(amount);
        if (error)
            return new Response(400, this.#formatMsg(error.details[0].message));

        // starting transaction
        const trx = await Model.startTransaction();
        try {
            const foundAccount = await Account.query(trx).findOne({ userId });
            if (!foundAccount) return new Response(404, 'Account not found.');

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

            return new Response(200, 'Account credited');
        } catch (exception) {
            await trx.rollback(); // rollback changes

            logger.error({
                method: 'fund_account',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async debitAccount(userId, amount) {
        // validating amount
        const { error } = accountValidators.validateAmount(amount);
        if (error)
            return new Response(400, this.#formatMsg(error.details[0].message));

        // starting transaction
        const trx = await Model.startTransaction();
        try {
            const foundAccount = await Account.query(trx).findOne({ userId });
            if (!foundAccount) return new Response(404, 'Account not found.');

            if (foundAccount.balance < amount)
                return new Response(402, 'Insufficient balance.');

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

            return new Response(200, 'Withdrawal successful');
        } catch (exception) {
            await trx.rollback(); // rollback changes

            debug(exception.message);
            logger.error({
                method: 'debit_account',
                message: exception.message,
                meta: exception.stack,
            });

            return new Response({
                isError: true,
                code: 500,
                msg: 'Something went wrong.',
            });
        }
    }

    async transferFunds(userId, transferFundsDto) {
        // validating amount
        const { error } = accountValidators.validateTransfer(
            userId,
            transferFundsDto
        );
        if (error)
            return new Response(400, this.#formatMsg(error.details[0].message));

        // starting transaction
        const trx = await Model.startTransaction();
        try {
            const { amount, destinationAccountId } = transferFundsDto;

            const foundSourceAccount = await Account.query(trx).findOne({
                userId,
            });
            if (!foundSourceAccount)
                return new Response(404, 'Account not found.');

            const foundDestinationAccount = await Account.query(trx).findOne({
                userId: destinationAccountId,
            });
            if (!foundDestinationAccount)
                return new Response(404, 'Destination account not found.');

            if (foundSourceAccount.balance < amount)
                return new Response(402, 'Insufficient balance.');

            // debit source, credit destination
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

            return new Response(200, 'Transfer successful');
        } catch (exception) {
            await trx.rollback(); // rollback changes

            logger.error({
                method: 'transfer_funds',
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
