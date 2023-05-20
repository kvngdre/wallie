import DuplicateError from '../errors/duplicate.error.js';
import pubsub from '../pubsub/PubSub.js';
import events from '../pubsub/events.js';
import User from './user.model.js';
import UserRepository from './user.repository.js';

const userRepository = new UserRepository();

class UserService {
  async signUp(createUserDto) {
    const newUser = await userRepository.insert(createUserDto);
    newUser.toObject;

    return newUser;
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
      const [{ count }] = await User.query()
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
