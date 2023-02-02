const {
    UniqueViolationError,
    ValidationError,
    ForeignKeyViolationError,
} = require('objection');
const getErrorField = require('../utils/getDuplicateKey');
const ParamInUseException = require('../errors/ConflictError');
const Transaction = require('../models/transaction.model');
const ValidationException = require('../errors/ValidationError');
const NotFoundException = require('../errors/NotFoundError');

class TransactionDAO {
    static async insert(newTxnDto, trx) {
        try {
            const newRecord = await Transaction.query(trx).insert(newTxnDto);
            return newRecord;
        } catch (exception) {
            // Catch account id not found error.
            if (exception instanceof ForeignKeyViolationError) {
                const key = getErrorField(exception);
                throw new NotFoundException(`${key} not found.`);
            }

            // Catch duplicate field error
            if (exception instanceof UniqueViolationError) {
                const key = getErrorField(exception);
                throw new ParamInUseException(`${key} already in use.`);
            }

            // Catch data validation error
            if (exception instanceof ValidationError)
                throw new ValidationException(exception.message);

            throw exception;
        }
    }

    static async findAll(queryObj, message = 'No transactions found') {
        try {
            const foundRecords = await Transaction.query()
                .joinRelated('account')
                .where(queryObj)
                .throwIfNotFound(message)
                .orderBy('id', 'desc');

            return foundRecords;
        } catch (exception) {
            throw exception;
        }
    }

    static async findById(txnId, message = 'Transaction not found') {
        try {
            const foundRecord = await Transaction.query()
                .findById(txnId)
                .throwIfNotFound(message);

            return foundRecord;
        } catch (exception) {
            throw exception;
        }
    }

    static async findOne(queryObj, message = 'Transaction not found') {
        try {
            const foundRecord = await Transaction.query()
                .joinRelated('account')
                .where(queryObj)
                .first()
                .throwIfNotFound(message);

            return foundRecord;
        } catch (exception) {
            throw exception;
        }
    }

    static async update(id, updateTxnDto, message = 'Transaction not found') {
        try {
            const foundRecord = await Transaction.query()
                .patchAndFetchById(id, updateTxnDto)
                .throwIfNotFound(message);

            return foundRecord;
        } catch (exception) {
            // Catch duplicate field error
            if (exception instanceof UniqueViolationError) {
                const key = getErrorField(exception);
                throw new ParamInUseException(`${key} already in use.`);
            }

            // Catch data validation error
            if (exception instanceof ValidationError)
                throw new ValidationException(exception.message);

            throw exception;
        }
    }

    static async delete(id, message = 'Transaction not found') {
        try {
            const numberOfDeletedRows = await Transaction.query()
                .deleteById(id)
                .throwIfNotFound(message);

            return numberOfDeletedRows;
        } catch (exception) {
            throw exception;
        }
    }
}

module.exports = TransactionDAO;
