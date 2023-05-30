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
   * @returns {Promise<User>} A promise that resolves with the inserted User object, or rejects with an error if the insertion fails.
   * @throws {DuplicateError} If a unique constraint violation occurs on any of the user properties.
   * @throws {Error} If any other error occurs during the insertion.
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
   * Retrieves all users that match filter object if any.
   * @param {UserFilter} [filter] - An object with user profile fields to filter by (optional).
   * @returns {Promise<Array.<User>>} A promise that resolves with an array of User objects that match the filter, or an empty array if none found.
   */
  async find(filter) {
    return User.query()
      .modify('filterName', filter.name)
      .modify('filterUsername', filter.username)
      .modify('filterEmail', filter.email)
      .modify('omitFields', 'password')
      .orderBy('first_name', 'asc');
  }

  /**
   * Retrieves a user by id.
   * @param {string} id - The user id
   * @returns {Promise<User|undefined>} A promise that resolves to the user object or undefined if not found.
   */
  async findById(id) {
    return User.query().findById(id);
  }

  /**
   * Retrieves a user by filter object.
   * @param {string} usernameOrEmail - An object with user profile fields to filter by (optional).
   * @returns {Promise<User|undefined>} A promise that resolves with the User object if found, or undefined if not found. Rejects if any error occurs.
   */
  async findByUsernameOrEmail(usernameOrEmail) {
    return await User.query()
      .where({ username: usernameOrEmail })
      .orWhere({ email: usernameOrEmail });
  }

  /**
   * Updates a user by id.
   * @param {string} id The user id
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<number>} A promise that resolves with the inserted User object, or rejects with an error if the user not found or update fails.
   * @throws {NotFoundError} If user cannot be found.
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

      throw exception;
    }
  }

  /**
   * Finds and deletes a user by id.
   * @param {string} id The user id
   * @returns {Promise<number>} The number of rows (users) deleted.
   * @throws {NotFoundError} If user cannot be found.
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
