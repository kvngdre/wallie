const debug = require('debug')('app:txnCtrl');
const logger = require('../utils/logger')('txnCtrl.js');
const ServerResponse = require('../utils/serverResponse');
const Transaction = require('../models/transaction.model');

class TransactionController {
    async getTransactions() {
        try {
            const foundTransactions = await Transaction.query();
            if (foundTransactions === 0)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Transactions not found.',
                });

            return new ServerResponse({ data: foundTransactions });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_txns',
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

    async getTransaction(id) {
        try {
            const foundTransaction = await Transaction.query().findById(id);
            if (!foundTransaction)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Transaction not found.',
                });

            return new ServerResponse({ data: foundTransaction });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_txn',
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

    async updateTransaction(id, txnDto) {
        try {
            const foundTransaction = await Transaction.query().findById(id);
            if (!foundTransaction)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Transaction not found.',
                });

            const updated = await foundTransaction
                .$query()
                .patchAndFetch(txnDto);

            return new ServerResponse({ data: updated });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'update_txn',
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

    async deleteTransaction(id) {
        try {
            const foundTransaction = await Transaction.query().findById(id);
            if (!foundTransaction)
                return new ServerResponse({
                    isError: true,
                    code: 404,
                    msg: 'Transaction not found.',
                });
            
            await foundTransaction.$query().delete();

            return new ServerResponse({
                code: 204,
                msg: 'Transaction deleted',
            });
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'delete_txn',
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
}

module.exports = new TransactionController();
