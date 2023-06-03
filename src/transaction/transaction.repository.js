import objection, { ValidationError } from 'objection';
import ConflictError from '../errors/conflict.error.js';
import ValidationException from '../errors/validation.error.js';
import { getDuplicateField } from '../helpers/repository.helpers.js';
import Transaction from './transaction.model.js';

class TransactionRepository {
  /**
   *
   * @param {import('./dto/create-transaction.dto.js').CreateTransactionDto} newTxnDto
   * @param {objection.Transaction} trx
   * @returns
   */
  async insert(newTxnDto, trx) {
    try {
      const newRecord = await Transaction.query(trx).insert(newTxnDto);
      return newRecord;
    } catch (exception) {
      // Catch account id not found error.
      if (exception instanceof objection.ForeignKeyViolationError) {
        const key = getDuplicateField(exception);
        throw new ConflictError(`${key} not found.`);
      }

      // Catch duplicate field error
      if (exception instanceof objection.UniqueViolationError) {
        const key = getDuplicateField(exception);
        throw new ConflictError(`${key} already in use.`);
      }

      // Catch data validation error
      if (exception instanceof ValidationError)
        throw new ValidationException(exception.message);

      throw exception;
    }
  }

  async findAll(queryObj, message = 'No transactions found') {
    const foundRecords = await Transaction.query()
      .joinRelated('account')
      .where(queryObj)
      .throwIfNotFound(message)
      .orderBy('id', 'desc');

    return foundRecords;
  }

  async findById(txnId, message = 'Transaction not found') {
    const foundRecord = await Transaction.query()
      .findById(txnId)
      .throwIfNotFound(message);

    return foundRecord;
  }

  async findOne(queryObj, message = 'Transaction not found') {
    const foundRecord = await Transaction.query()
      .joinRelated('account')
      .where(queryObj)
      .first()
      .throwIfNotFound(message);

    return foundRecord;
  }

  async update(id, updateTxnDto, message = 'Transaction not found') {
    try {
      const foundRecord = await Transaction.query()
        .patchAndFetchById(id, updateTxnDto)
        .throwIfNotFound(message);

      return foundRecord;
    } catch (exception) {
      // Catch duplicate field error
      if (exception instanceof objection.UniqueViolationError) {
        const key = getDuplicateField(exception);
        throw new ConflictError(`${key} already in use.`);
      }

      // Catch data validation error
      if (exception instanceof ValidationError)
        throw new ValidationException(exception.message);

      throw exception;
    }
  }

  async delete(id, message = 'Transaction not found') {
    const numberOfDeletedRows = await Transaction.query()
      .deleteById(id)
      .throwIfNotFound(message);

    return numberOfDeletedRows;
  }
}

export default TransactionRepository;
