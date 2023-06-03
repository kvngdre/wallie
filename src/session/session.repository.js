import objection from 'objection';
import ConflictError from '../errors/conflict.error.js';
import Session from './session.model.js';

class SessionRepository {
  /**
   * Inserts a new account into the database.
   * @param {NewSessionDto} newSessionDto
   * @param {objection.Transaction} [trx] - Knex transaction object.
   * @returns {Promise<Session>} A promise that resolves with the inserted Session object, or rejects with an error if the insertion fails.
   * @throws {ConflictError} If a unique constraint violation occurs on any of the session properties.
   * @throws {Error} If any other error occurs during the insertion.
   */
  async insert(newSessionDto, trx) {
    try {
      return await Session.query(trx).insert(newSessionDto);
    } catch (exception) {
      if (exception instanceof objection.UniqueViolationError) {
        throw new ConflictError(
          `Session with user id ${newSessionDto.user_id} already exists.`,
        );
      }

      throw exception;
    }
  }

  /**
   *
   * @returns {Promise<Array.<Session>>}
   */
  async find() {
    return await Session.query().orderBy('created_at', 'desc');
  }

  /**
   * Retrieve a session by id.
   * @param {string} id - The account id
   * @returns {Promise<Session|undefined>} A promise that resolves to the account object or undefined if not found.
   */
  async findById(id) {
    return await Session.query().findById(id);
  }

  /**
   * Retrieves a session by user id.
   * @param {string} userId - The user id.
   * @returns {Promise<Session|undefined>} A promise that resolves with the Session object if found, or undefined if not found. Rejects if any error occurs.
   */
  async findByUserId(userId) {
    return await Session.query().where({ user_id: userId }).first();
  }

  /**
   *
   * @param {string} id - The session id
   * @param {UpdateSessionDto} updateSessionDto
   * @param {objection.Transaction} [trx] - Knex transaction object.
   * @returns {Promise<Session>}
   * @throws {NotFoundError} If session cannot be found.
   */
  async update(id, updateSessionDto, trx) {
    try {
      const foundRecord = await Session.query().findById(id);
      if (!foundRecord) {
        throw new NotFoundError('Operation failed. Session not found.');
      }

      return await Session.query(trx).patch(updateSessionDto);
    } catch (exception) {
      if (exception instanceof UniqueViolationError) {
        throw new ConflictError(
          `Session with user id ${updateSessionDto.user_id} already exists.`,
        );
      }

      throw exception;
    }
  }

  /**
   *
   * @param {string} userId - The user id
   * @param {UpdateSessionDto} updateSessionDto
   * @param {objection.Transaction} [trx] - Knex transaction object.
   * @returns {Promise<Session>}
   * @throws {NotFoundError} If session cannot be found.
   */
  async updateByUserId(userId, updateSessionDto, trx) {
    try {
      const foundRecord = await Session.query().findOne({ user_id: userId });
      if (!foundRecord) {
        throw new NotFoundError('Operation failed. Session not found.');
      }

      return await Session.query(trx).patch(updateSessionDto);
    } catch (exception) {
      if (exception instanceof UniqueViolationError) {
        throw new ConflictError(
          `Session with user id ${updateSessionDto.user_id} already exists.`,
        );
      }

      throw exception;
    }
  }

  /**
   * Finds and deletes a session by id.
   * @param {string} id - The session id.
   * @returns {Promise<number>} The number of rows (sessions) deleted.
   */
  async delete(id) {
    const foundRecord = await Session.query().findById(id);
    if (!foundRecord) {
      throw new NotFoundError('Operation failed. Session not found.');
    }

    return await foundRecord.$query().delete(id);
  }
}

export default SessionRepository;
