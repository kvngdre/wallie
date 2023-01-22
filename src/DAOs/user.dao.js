const User = require('../models/user.model');
const ValidationError = require('../errors/ValidationError');

class UserDAO {
    static async insert(createUserDto) {
        try {
            const newRecord = await User.query()
                .insert(createUserDto)
                .onConflict('email')
                .ignore();

            return newRecord;
        } catch (exception) {
            if (exception.name === 'ValidationError')
                throw new ValidationError(exception.message);

            throw exception;
        }
    }

    static async findAll() {
        try {
            const foundRecords = await User.query().orderBy(
                'created_at',
                'desc'
            );
            return foundRecords;
        } catch (exception) {
            throw exception;
        }
    }

    static async findOne(userId) {
        try {
            const foundRecord = await User.query().findById(userId);
            return foundRecord;
        } catch (exception) {
            throw exception;
        }
    }

    static async update(userId, updateUserDto) {
        try {
            const updatedRecord = await User.query().patchAndFetchById(
                userId,
                updateUserDto
            );
            return updatedRecord;
        } catch (exception) {
            if (exception.name === 'ValidationError')
                throw new ValidationError(exception.message);

            throw exception;
        }
    }

    static async delete(userId) {
        try {
            const deletedRecord = await User.query().deleteById(userId);
            return deletedRecord;
        } catch (exception) {
            throw exception;
        }
    }
}

module.exports = UserDAO;
