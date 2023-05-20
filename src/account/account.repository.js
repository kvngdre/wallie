import objection, { ValidationError } from 'objection';
import DuplicateError from '../errors/duplicate.error.js';
import ValidationException from '../errors/validation.error.js';
import getDuplicateField from '../utils/getDuplicateField.utils.js';
import Account from './account.model.js';

class AccountRepository {
  /**
   *
   * @param {NewAccountDto} newAccountDto
   * @returns {Promise<>}
   */
  async insert(newAccountDto) {
    try {
      const newRecord = await Account.query().insertAndFetch(newAccountDto);
      return newRecord;
    } catch (exception) {
      // Catch duplicate field error
      if (exception instanceof UniqueViolationError) {
        const key = getDuplicateField(exception);
        throw new DuplicateError(`${key} already in use.`);
      }

      // Catch data validation error
      if (exception instanceof ValidationError)
        throw new ValidationException(exception.message);

      throw exception;
    }
  }

  async findAll(message = 'No accounts found') {
    const foundRecords = await Account.query()
      .throwIfNotFound(message)
      .orderBy('id', 'desc');

    return foundRecords;
  }

  async findById(accountId, message = 'Account not found') {
    const foundRecord = await Account.query()
      .findById(accountId)
      .throwIfNotFound(message);

    return foundRecord;
  }

  async findOne(queryObj, message = 'Account not found') {
    const foundRecord = await Account.query()
      .where(queryObj)
      .first()
      .throwIfNotFound(message);

    return foundRecord;
  }

  async update(accountId, updateAccountDto, trx) {
    try {
      const updateRecord = await Account.query(trx)
        .patchAndFetchById(accountId, updateAccountDto)
        .throwIfNotFound(message);

      return updateRecord;
    } catch (exception) {
      // Rollback changes and abort transaction.
      trx.rollback();

      // Catch duplicate field error
      if (exception instanceof UniqueViolationError) {
        const key = getDuplicateField(exception);
        throw new DuplicateError(`${key} already in use.`);
      }

      // Catch data validation error
      if (exception instanceof ValidationError)
        throw new ValidationException(exception.message);

      throw exception;
    }
  }

  async delete(accountId, message = 'Account not found') {
    const numberOfDeletedRows = await Account.query()
      .deleteById(accountId)
      .throwIfNotFound(message);

    return numberOfDeletedRows;
  }
}

export default AccountRepository;
