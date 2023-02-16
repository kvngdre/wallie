const {
    validateNewTxnDto,
    validateUpdateTxnDto,
} = require('../validators/transaction.validator');
const { httpStatusCodes } = require('../utils/constants');
const APIResponse = require('../utils/APIResponse');
const formatErrorMsg = require('../utils/formatErrorMsg');
const txnService = require('../services/transaction.service');
const ValidationException = require('../errors/ValidationError');
class TransactionController {
    static async createTransaction(req, res) {
        // Validating new transaction dto
        const { error } = validateNewTxnDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const transaction = await txnService.createTransaction(req.body);
        const response = new APIResponse('Transaction created.', transaction);

        return res.status(httpStatusCodes.CREATED).json(response);
    }

    static async getAllTransactions(req, res) {
        const { count, foundTransactions } = await txnService.getTransactions(
            req.currentUser
        );

        function getMessage() {
            if (count == 1) return `${count} record found.`;
            return `${count} records found.`;
        }
        const response = new APIResponse(getMessage(), foundTransactions);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async getTransaction(req, res) {
        const transaction = await txnService.getTransaction(
            req.currentUser.id,
            req.params.id
        );
        const response = new APIResponse('Fetched transaction.', transaction);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async updateTransaction(req, res) {
        const { body, params } = req;

        // validating update transaction dto
        const { error } = validateUpdateTxnDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const transaction = await txnService.updateTransaction(params.id, body);
        const response = new APIResponse('Transaction updated.', transaction);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async deleteTransaction(req, res) {
        await txnService.deleteTransaction(req.params.id);
        const response = new APIResponse('Transaction deleted.');

        return res.status(httpStatusCodes.OK).json(response);
    }
}

module.exports = TransactionController;
