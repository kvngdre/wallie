import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import AccountRepository from '../account/account.repository.js';
import DuplicateError from '../errors/duplicate.error.js';
import Logger from '../utils/logger.utils.js';
import UserModel from './user.model.js';
import UserRepository from './user.repository.js';

class UserService {
  #logger;
  #accountRepository;
  #userRepository;

  /**
   * @param {Logger} logger
   * @param {AccountRepository} accountRepository - The account repository instance.
   * @param {UserRepository} userRepository - The user repository instance.
   */
  constructor(logger, accountRepository, userRepository) {
    this.#logger = logger;
    this.#accountRepository = accountRepository;
    this.#userRepository = userRepository;
  }

  /**
   * Create a new user and account.
   * @param {SignUpDto} signUpDto
   * @returns {Promise<UserProfile>}
   */
  async signUp(signUpDto) {
    const userUuid = uuidv4();
    const accountUuid = uuidv4();

    signUpDto.id = userUuid;
    signUpDto.account.id = accountUuid;
    signUpDto.account.user_id = userUuid;

    const result = await Model.transaction(async (trx) => {
      const [newUser] = await Promise.all([
        this.#userRepository.insert(signUpDto, trx),
        this.#accountRepository.insert(signUpDto.account, trx),
      ]);

      return newUser.toObject();
    });

    return result;
  }

  async getUsers(queryObj) {
    const foundUsers = await UserRepository.findAll(queryObj);
    const count = Intl.NumberFormat('en-US').format(foundUsers.length);

    // Modify array inplace to delete user passwords.
    foundUsers.forEach((user) => user.omitPassword());

    return { count, foundUsers };
  }

  async getUser(userId) {}

  async updateUser(currentUser, updateUserDto) {
    const updatedUser = await UserRepository.update(currentUser, updateUserDto);
    updatedUser.omitPassword();

    return updatedUser;
  }

  async deleteUser(currentUser, userId) {
    if (currentUser.id == userId) {
      const [{ count }] = await UserModel.query()
        .where({ role: user })
        .count({ count: 'id' });

      if (count > 0)
        throw new DuplicateError('Conflict! Admin user must be the only user.');
    }
    // @TODO: invalidate access token...
    // possible solution is to implement refresh tokens with short lived access tokens.
    return await UserRepository.delete(userId);
  }
}

export default UserService;
