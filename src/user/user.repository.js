import objection from 'objection';
import DuplicateError from '../errors/duplicate.error.js';
import NotFoundError from '../errors/notFound.error.js';
import ValidationError from '../errors/validation.error.js';
import getDuplicateField from '../utils/getDuplicateField.utils.js';
import User from './user.model.js';

class UserRepository {
  /**
   * Inserts a new user record into the database.
   * @param {CreateUserDto} createUserDto
   * @param {objection.Transaction} [trx] - Knex transaction object.
   * @returns {Promise<User>}
   */
  async insert(createUserDto, trx) {
    try {
      return await User.query(trx).insert(createUserDto);
    } catch (exception) {
      if (exception instanceof objection.UniqueViolationError) {
        const field = getDuplicateField(exception);
        throw new DuplicateError(`${field} has already been taken.`);
      }

      throw exception;
    }
  }

  /**
   * Returns all users that match filter if any.
   * @param {UserFilter} [filter] - An object with user profile fields to filter by (optional).
   * @returns {Promise<Array.<User>>} - A promise that resolves with an array of User objects that match the filter, or an empty array if none found.
   */
  async find(filter) {
    console.log(filter);
    return await User.query()
      .modify('filterName', filter.name)
      .modify('filterUsername', filter.username)
      .modify('filterEmail', filter.email)
      .modify('omitField', 'password')
      .orderBy('first_name', 'asc');
  }

  /**
   * Find and returns a user profile by id.
   * @param {number} id User id
   * @returns {Promise<UserProfile>}
   */
  async findById(id) {
    return await User.query().findById(id);
  }

  /**
   * Find and returns a user profile by filter object.
   * @param {Partial<UserProfile>} filter User profile fields filter object.
   * @returns {Promise<UserProfile>}
   */
  async findOne(filter) {
    return await User.query().where(filter).first();
  }

  /**
   * Finds and updates a user by id.
   * @param {number} id The user id
   * @param {Partial<User>} updateUserDto
   * @returns {Promise<number>}
   */
  async update(id, updateUserDto) {
    try {
      const foundRecord = await User.query().findById(id);
      if (!foundRecord) {
        throw new NotFoundError('Operation failed. User profile not found.');
      }

      return await foundRecord.$query().patch(updateUserDto);
    } catch (exception) {
      if (exception instanceof objection.UniqueViolationError) {
        const field = getDuplicateField(exception);
        throw new DuplicateError(`${field} already in use`);
      }

      if (exception instanceof objection.ValidationError)
        throw new ValidationError(exception.message);

      throw exception;
    }
  }

  /**
   * Finds and deletes a user by id.
   * @param {number} id The user id
   * @returns {Promise<number>}
   */
  async delete(id) {
    const foundRecord = await User.query().findById(id);
    if (!foundRecord) {
      throw new NotFoundError('Operation failed. User profile not found.');
    }

    return await foundRecord.$query().delete();
  }
}

export default UserRepository;
