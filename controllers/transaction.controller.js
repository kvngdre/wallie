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

}

module.exports = new TransactionController();
