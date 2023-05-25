import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import AccountRepository from '../account/account.repository.js';
import DuplicateError from '../errors/duplicate.error.js';
import NotFoundError from '../errors/notFound.error.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import formatItemCountMessage from '../utils/formatItemCountMessage.js';
import UserModel from './user.model.js';
import UserRepository from './user.repository.js';

class UserService {
  #accountRepository;
  #userRepository;

  /**
   * @class UserService
   * @param {AccountRepository} accountRepository - The account repository instance.
   * @param {UserRepository} userRepository - The user repository instance.
   */
  constructor(accountRepository, userRepository) {
    this.#accountRepository = accountRepository;
    this.#userRepository = userRepository;
  }

  /**
   * Create a new user and account.
   * This function is used to sign up the user to the service.
   * @param {SignUpDto} signUpDto
   * @returns {Promise<UserProfile>}
   */
  async signUp(signUpDto) {
    signUpDto.user.id = uuidv4();
    signUpDto.account.id = uuidv4();
    signUpDto.account.user_id = signUpDto.user.id;

    const result = await Model.transaction(async (trx) => {
      const [newUser] = await Promise.all([
        this.#userRepository.insert(signUpDto.user, trx),
        this.#accountRepository.insert(signUpDto.account, trx),
      ]);

      return newUser.toObject();
    });

    return new ApiResponse(
      'You have successfully signed up for the service.',
      result,
      {
        verification_url: '',
        next_steps: [
          'Check email for OTP to verify your account.',
          'Log in  and explore the features.',
          'Customize your profile, manage your settings, and access our support.',
        ],
      },
    );
  }

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - A data transfer object for new user information.
   * @returns {Promise<UserProfile>}
   */
  async createUser(createUserDto) {
    createUserDto.id = uuidv4();
    const newUser = await this.#userRepository.insert(createUserDto);

    return new ApiResponse('User successfully created', newUser.toObject());
  }

  /**
   * This function is used to find users that match the filter if any.
   * @param {UserFilter} [filter] - An object with user profile fields to filter by (optional).
   * @returns {Promise.<ApiResponse>}
   */
  async getUsers(filter) {
    const foundUsers = await this.#userRepository.find(filter);
    if (foundUsers.length === 0) throw new NotFoundError('No records found');
    const message = formatItemCountMessage(foundUsers.length);

    return new ApiResponse(message, foundUsers);
  }

  /**
   * Retrieves the user by it's unique id field.
   * @param {string} userId - The user id.
   * @returns {Promise.<ApiResponse>}
   */
  async getUser(userId) {
    const foundUser = await this.#userRepository.findById(userId);
    if (!foundUser) throw new NotFoundError('User Not Found');
    // console.log(foundUser.toObject());

    return new ApiResponse('User Found', foundUser.toObject());
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
