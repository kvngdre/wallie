const { UniqueViolationError, ValidationError } = require('objection');
const getDuplicateKey = require('../utils/getDuplicateKey');
const ParamInUseException = require('../errors/ConflictError');
const User = require('../models/user.model');
const ValidationException = require('../errors/ValidationError');

class UserDAO {
    static async insert(createUserDto) {
        try {
            const newRecord = await User.query().insert(createUserDto);

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

    static async findAll(queryObj = {}, message = 'No users found') {
        const foundRecords = await User.query()
            .where(queryObj)
            .throwIfNotFound(message)
            .orderBy('id', 'desc');

        return foundRecords;
    }

    static async findById(id, message = 'User not found') {
        const foundRecord = await User.query()
            .findById(id)
            .throwIfNotFound(message);

        return foundRecord;
    }

    static async findOne(queryObj, message = 'User not found') {
        const foundRecord = await User.query()
            .where(queryObj)
            .first()
            .throwIfNotFound(message);

        return foundRecord;
    }

    static async update(
        currentUser,
        updateUserDto,
        message = 'User not found'
    ) {
        try {
            const foundRecord = await User.query()
                .patchAndFetchById(currentUser.id, updateUserDto)
                .throwIfNotFound(message);

            return foundRecord;
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

    static async delete(id, message = 'User not found') {
        const numberOfDeletedRows = await User.query()
            .deleteById(id)
            .throwIfNotFound(message);

        return numberOfDeletedRows;
    }
}

module.exports = UserDAO;
