import objection from 'objection';
import DuplicateError from '../errors/duplicate.error.js';
import NotFoundError from '../errors/notFound.error.js';
import ValidationError from '../errors/validation.error.js';
import getDuplicateField from '../utils/getDuplicateField.utils.js';

class UserRepository {
  /**
   * Inserts a new user record into the database.
   * @param {NewUserDto} newUserDto
   * @param {Transaction} trx Sequelize transaction object.
   * @returns {Promise<User>}
   */
  async insert(newUserDto, trx) {
    try {
      return await User.query(trx).insert(newUserDto);
    } catch (exception) {
      if (exception instanceof objection.UniqueViolationError) {
        const field = getDuplicateField(exception);
        throw new DuplicateError(`${field} already in use`);
      }

      throw exception;
    }
  }

  /**
   * Returns all users that match filter if any.
   * @param {Partial<UserProfile>} [filter] User profile fields filter object.
   * @returns {Promise<Array.<User>>}
   */
  async find(filter = {}) {
    return await User.query().where(filter).orderBy('id', 'desc');
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
