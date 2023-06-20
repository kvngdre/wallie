import Token from './token.model.js';

class TokenRepository {
  /**
   * Inserts a new token record into the database.
   * @param {CreateTokenDto} createTokenDto - An object that contains the token data to be inserted.
   * @param {objection.Transaction} [trx] - An optional Knex transaction object that can be used to perform the insertion as part of a larger transaction.
   * @returns {Promise<Token>} A promise that resolves with the inserted Token object, or rejects with an error if the insertion fails.
   * @throws {Error} If any other error occurs during the insertion, such as a database connection error or a validation error.
   */
  async insert(createTokenDto, trx) {
    return await Token.query(trx).insert(createTokenDto);
  }

  /**
   * Retrieves all tokens that match filter object if any.
   * @param {UpdateTokenDto} [filter] - An object with token profile fields to filter by (optional).
   * @returns {Promise<Array<Token>>} A promise that resolves with an array of User objects that match the filter, or an empty array if none found.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async find(filter) {
    return await Token.query().find(filter).orderBy('created_at', 'desc');
  }

  /**
   * Retrieves all tokens that match filter object if any.
   * @param {UpdateTokenDto} [filter] - An object with token profile fields to filter by (optional).
   * @returns {Promise<Token | undefined>} A promise that resolves with an array of User objects that match the filter, or an empty array if none found.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async findOne(filter) {
    return await Token.query().findOne(filter);
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the token to be retrieved.
   * @returns {Promise<Token | undefined>} A promise that resolves to the user object or undefined if not found.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async findById(id) {
    return Token.query().findById(id);
  }

  /**
   * Retrieves a user by the username or email address.
   * @param {string} userId - An object with user profile fields to filter by (optional).
   * @returns {Promise<Token | undefined>} A promise that resolves with the User object if found, or undefined if not found. Rejects if any error occurs.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async findByUserId(userId) {
    return await Token.query().findOne({ user_id: userId });
  }

  /**
   * Updates a user by ID.
   * @param {string} id The token ID
   * @param {UpdateTokenDto} updateUserDto
   * @returns {Promise<number>} A promise that resolves with the inserted User object, or rejects with an error if the user not found or update fails.
   * @throws {NotFoundError} If token cannot be found.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async update(id, updateTokenDto) {
    const foundRecord = await User.query().findById(id);
    if (!foundRecord) {
      throw new NotFoundError('Operation failed. Token not found.');
    }

    return await foundRecord.$query().patch(updateTokenDto);
  }

  /**
   * Finds and deletes a token by ID.
   * @param {string} id The token ID
   * @returns {Promise<number>} The number of rows (users) deleted.
   * @throws {NotFoundError} If user cannot be found.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async remove(id) {
    const foundRecord = await Token.query().findById(id);
    if (!foundRecord) {
      throw new NotFoundError('Operation failed. Token not found.');
    }

    return await foundRecord.$query().delete();
  }

  /**
   * Finds and deletes a token by field(s).
   * @param {TokenFilter} filter The filter object
   * @returns {Promise<number>} The number of rows (users) deleted.
   * @throws {NotFoundError} If user cannot be found.
   * @throws {Error} If any other error occurs, such as a database connection error.
   */
  async removeByFilter(filter) {
    const affectedRows = await Token.query().findOne(filter).delete();
    if (affectedRows < 1) {
      throw new NotFoundError('Operation failed. Token not found.');
    }
  }
}

export default TokenRepository;
