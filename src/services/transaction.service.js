const { admin } = require('../utils/userRoles');
const { v4 } = require('uuid');
const events = require('../utils/events');
const pubsub = require('../utils/PubSub');
const TransactionDAO = require('../daos/transaction.dao');

class TransactionService {
    constructor() {
        this.genReference = () => v4();

        // Event subscriptions
        pubsub.subscribe(events.account.credit, this.createTransaction);
        pubsub.subscribe(events.account.debit, this.createTransaction);
    }

    createTransaction = async (newTxnDto, trx) => {
        newTxnDto.reference = this.genReference();
        const newTransaction = await TransactionDAO.insert(newTxnDto, trx);

        return newTransaction;
    };

    async getTransactions(currentUser) {
        const queryObj = {};

        if (currentUser.role !== admin)
            queryObj['account.user_id'] = currentUser.id;

        const foundTransactions = await TransactionDAO.findAll(queryObj);
        const count = Intl.NumberFormat('en-US').format(
            foundTransactions.length
        );

        return { count, foundTransactions };
    }

    async getTransaction(currentUserId, txnId) {
        const queryObj = {
            'transactions.id': txnId,
            'account.user_id': currentUserId,
        };
        const foundTransaction = await TransactionDAO.findOne(queryObj);

        return foundTransaction;
    }

    async updateTransaction(txnId, updateTxnDto) {
        const updatedTransaction = await TransactionDAO.update(
            txnId,
            updateTxnDto
        );

        return updatedTransaction;
    }

    async deleteTransaction(txnId) {
        return await TransactionDAO.delete(txnId);
    }
}

module.exports = new TransactionService();