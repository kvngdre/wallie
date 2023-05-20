import objection, { QueryBuilder, ValidationError } from 'objection';
import DuplicateError from '../errors/duplicate.error.js';
import ValidationException from '../errors/validation.error.js';
import getDuplicateField from '../utils/getDuplicateField.utils.js';
import User from './user.model.js';

class UserRepository {
  /**
   * Inserts a new user record into the database.
   * @param {NewUserDto} newUserDto
   * @returns {Promise<User>}
   */
  async insert(newUserDto) {
    try {
      return await User.query().insert(newUserDto);
    } catch (exception) {
      if (exception instanceof objection.UniqueViolationError) {
        const field = getDuplicateField(exception);
        throw new DuplicateError(`${field} already in use`);
      }

      if (exception instanceof ValidationError) {
        throw new ValidationError(exception.message);
      }

      throw exception;
    }
  }

  async findAll(queryObj = {}, message = 'No users found') {
    const foundRecords = await User.query()
      .where(queryObj)
      .throwIfNotFound(message)
      .orderBy('id', 'desc');

    return foundRecords;
  }

  async findById(id, message = 'User not found') {
    const foundRecord = await User.query()
      .findById(id)
      .throwIfNotFound(message);

    return foundRecord;
  }

  async findOne(queryObj, message = 'User not found') {
    const foundRecord = await User.query()
      .where(queryObj)
      .first()
      .throwIfNotFound(message);

    return foundRecord;
  }

  async update(currentUser, updateUserDto, message = 'User not found') {
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

  async delete(id, message = 'User not found') {
    const numberOfDeletedRows = await User.query()
      .deleteById(id)
      .throwIfNotFound(message);

    return numberOfDeletedRows;
  }
}

export default UserRepository;
