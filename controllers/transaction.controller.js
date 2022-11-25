const debug = require('debug')('app:txnCtrl');
const logger = require('../utils/logger')('txnCtrl.js');
const Response = require('../utils/serverResponse');
const Transaction = require('../models/transaction.model');

class TransactionController {
    async getTransactions() {
        try {
            const foundTransactions = await Transaction.query();
            if (foundTransactions === 0)
                return new Response(404, 'Transactions not found.');

            return new Response(200, 'Successful', foundTransactions);
        } catch (exception) {
            logger.error({
                method: 'get_txns',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }

    async getTransaction(id) {
        try {
            const foundTransaction = await Transaction.query().findById(id);
            if (!foundTransaction)
                return new Response(404, 'Transaction not found.');

            return new Response(200, 'Successful', foundTransaction);
        } catch (exception) {
            logger.error({
                method: 'get_txn',
                message: exception.message,
                meta: exception.stack,
            });
            debug(exception.message);

            return new Response(500, 'Something went wrong.');
        }
    }
}

module.exports = new TransactionController();
