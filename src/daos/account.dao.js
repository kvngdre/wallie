const { UniqueViolationError, ValidationError } = require('objection');
const Account = require('../models/account.model');
const getDuplicateKey = require('../utils/getDuplicateKey');
const ParamInUseException = require('../errors/ConflictError');
const ValidationException = require('../errors/ValidationError');

class AccountDAO {
    static async insert(createAccountDto) {
        try {
            const newRecord = await Account.query().insertAndFetch(
                createAccountDto
            );
            return newRecord;
        } catch (exception) {
            // Catch duplicate field error
            if (exception instanceof UniqueViolationError) {
                const key = getDuplicateKey(exception);
                throw new ParamInUseException(`${key} already in use.`);
            }

            // Catch data validation error
            if (exception instanceof ValidationError)
                throw new ValidationException(exception.message);

            throw exception;
        }
    }

    static async findAll(message = 'No accounts found') {
        const foundRecords = await Account.query()
            .throwIfNotFound(message)
            .orderBy('id', 'desc');

        return foundRecords;
    }

    static async findById(accountId, message = 'Account not found') {
        const foundRecord = await Account.query()
            .findById(accountId)
            .throwIfNotFound(message);

        return foundRecord;
    }

    static async findOne(queryObj, message = 'Account not found') {
        const foundRecord = await Account.query()
            .where(queryObj)
            .first()
            .throwIfNotFound(message);

        return foundRecord;
    }

    static async update(
        accountId,
        updateAccountDto,
        trx,
        message = 'Account not found'
    ) {
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
                const key = getDuplicateKey(exception);
                throw new ParamInUseException(`${key} already in use.`);
            }

            // Catch data validation error
            if (exception instanceof ValidationError)
                throw new ValidationException(exception.message);

            throw exception;
        }
    }

    static async delete(accountId, message = 'Account not found') {
        const numberOfDeletedRows = await Account.query()
            .deleteById(accountId)
            .throwIfNotFound(message);

        return numberOfDeletedRows;
    }
}

module.exports = AccountDAO;
