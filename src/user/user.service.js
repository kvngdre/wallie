import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import AccountRepository from '../account/account.repository.js';
import DuplicateError from '../errors/duplicate.error.js';
import { uuidToBin } from '../utils/uuidConverter.utils.js';
import UserModel from './user.model.js';
import UserRepository from './user.repository.js';

class UserService {
  #accountRepository;
  #userRepository;

  /**
   *
   * @param {AccountRepository} accountRepository The account repository instance.
   * @param {UserRepository} userRepository The user repository instance.
   */
  constructor(accountRepository, userRepository) {
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

    signUpDto.id = uuidToBin(userUuid);
    signUpDto.account.id = uuidToBin(accountUuid);
    signUpDto.account.user_id = uuidToBin(userUuid);

    return await Model.transaction(async (trx) => {
      const [newUser] = await Promise.all([
        this.#userRepository.insert(signUpDto, trx),
        this.#accountRepository.insert(signUpDto.account),
      ]);

      newUser.toObject();

      return newUser;
    });
  }

  async getUsers(queryObj) {
    const foundUsers = await UserRepository.findAll(queryObj);
    const count = Intl.NumberFormat('en-US').format(foundUsers.length);

    // Modify array inplace to delete user passwords.
    foundUsers.forEach((user) => user.omitPassword());

    return { count, foundUsers };
  }

  async getUser(userId) {
    const foundUser = await UserRepository.findById(userId);
    foundUser.omitPassword();

    return foundUser;
  }

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
