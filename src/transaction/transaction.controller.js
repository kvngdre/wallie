import ValidationError from '../errors/validation.error.js';
import TransactionValidator from '../transaction/transaction.validator.js';
import HttpCode from '../utils/httpCodes.utils.js';
import txnService from './transaction.service.js';

const transactionValidator = new TransactionValidator();
class TransactionController {
  async createTransaction(req, res) {
    // Validating new transaction dto
    const { error } = transactionValidator.validateNewTxnDto(req.body);
    if (error) {
      throw new ValidationError(errorMsg);
    }

    const transaction = await txnService.createTransaction(req.body);
    const response = new APIResponse('Transaction created.', transaction);

    return res.status(HttpCode.CREATED).json(response);
  }

  async getAllTransactions(req, res) {
    const { count, foundTransactions } = await txnService.getTransactions(
      req.currentUser,
    );

    function getMessage() {
      if (count == 1) return `${count} record found.`;
      return `${count} records found.`;
    }
    const response = new APIResponse(getMessage(), foundTransactions);

    return res.status(HttpCode.OK).json(response);
  }

  async getTransaction(req, res) {
    const transaction = await txnService.getTransaction(
      req.currentUser.id,
      req.params.id,
    );
    const response = new APIResponse('Fetched transaction.', transaction);

    return res.status(HttpCode.OK).json(response);
  }

  async updateTransaction(req, res) {
    const { body, params } = req;

    // validating update transaction dto
    const { error } = transactionValidator.validateUpdateTxnDto(req.body);
    if (error) {
      throw new ValidationError(errorMsg);
    }

    const transaction = await txnService.updateTransaction(params.id, body);
    const response = new APIResponse('Transaction updated.', transaction);

    return res.status(HttpCode.OK).json(response);
  }

  async deleteTransaction(req, res) {
    await txnService.deleteTransaction(req.params.id);
    const response = new APIResponse('Transaction deleted.');

    return res.status(HttpCode.OK).json(response);
  }
}

export default TransactionController;
