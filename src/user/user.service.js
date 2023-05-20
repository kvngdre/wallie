import { Model } from 'objection';
import AccountRepository from '../account/account.repository.js';
import DuplicateError from '../errors/duplicate.error.js';
import UserModel from './user.model.js';
import UserRepository from './user.repository.js';

const userRepository = new UserRepository();
const accountRepository = new AccountRepository();

class UserService {
  /**
   *
   * @param {SignUpDto} signUpDto
   * @returns
   */
  async signUp(signUpDto) {
    return await Model.transaction(async (trx) => {
      const [newUser] = await Promise.all([
        userRepository.insert(signUpDto, trx),
        accountRepository.insert(),
      ]);

      newUser.toObject;

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
