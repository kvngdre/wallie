import objection, { ValidationError } from 'objection';
import DuplicateError from '../errors/duplicate.error.js';
import ValidationException from '../errors/validation.error.js';
import getErrorField from '../utils/getDuplicateField.utils.js';
import Transaction from './transaction.model.js';

class TransactionDAO {
  async insert(newTxnDto, trx) {
    try {
      const newRecord = await Transaction.query(trx).insert(newTxnDto);
      return newRecord;
    } catch (exception) {
      // Catch account id not found error.
      if (exception instanceof objection.ForeignKeyViolationError) {
        const key = getErrorField(exception);
        throw new DuplicateError(`${key} not found.`);
      }

      // Catch duplicate field error
      if (exception instanceof objection.UniqueViolationError) {
        const key = getErrorField(exception);
        throw new DuplicateError(`${key} already in use.`);
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
        const key = getErrorField(exception);
        throw new DuplicateError(`${key} already in use.`);
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

export default TransactionDAO;