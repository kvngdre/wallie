import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import AccountRepository from '../account/account.repository.js';
import NotFoundError from '../errors/notFound.error.js';
import ApiResponse from '../utils/api-response.utils.js';
import formatItemCountMessage from '../utils/formatItemCountMessage.js';
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
   * @param {SignUpDto} signUpDto - An object with user and account data
   * @returns {Promise<AppResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
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

    //   // Generate a verification token using jsonwebtoken
    // const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
    //   expiresIn: "24h",
    // });

    // // Generate a verification url using url-join
    // const verification_url = urlJoin(
    //   process.env.BASE_URL,
    //   "verify",
    //   result.id,
    //   token
    // );

    // // Send a verification email to the user using nodemailer
    // await this.#emailService.sendVerificationEmail(result.email, verification_url);

    return new AppResponse(
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
   * @returns {Promise<AppResponse>}
   */
  async createUser(createUserDto) {
    createUserDto.id = uuidv4();
    const newUser = await this.#userRepository.insert(createUserDto);

    return new AppResponse('User successfully created', newUser.toObject());
  }

  /**
   * This function is used to find users that match the filter if any.
   * @param {UserFilter} [filter] - An object with user profile fields to filter by (optional).
   * @returns {Promise.<AppResponse>}
   */
  async getUsers(filter) {
    const foundUsers = await this.#userRepository.find(filter);
    if (foundUsers.length === 0) throw new NotFoundError('No Users Found');
    const message = formatItemCountMessage(foundUsers.length);

    return new AppResponse(message, foundUsers);
  }

  /**
   * Retrieves the user by it's unique id field.
   * @param {string} userId - The user id
   * @returns {Promise.<AppResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async getUser(userId) {
    const foundUser = await this.#userRepository.findById(userId);
    if (!foundUser) throw new NotFoundError('User Not Found');

    return new AppResponse('User Found', foundUser.toObject());
  }

  /**
   * Updates the user information by id
   * @param {string} userId - The user id
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise.<AppResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async updateUser(userId, updateUserDto) {
    await this.#userRepository.update(userId, updateUserDto);

    return new AppResponse('User Updated Successfully');
  }

  /**
   * Deletes a user by id
   * @param {string} userId - The user id
   * @returns {Promise.<AppResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async deleteUser(userId) {
    await this.#userRepository.delete(userId);

    return new AppResponse('User Deleted Successfully');
  }
}

export default UserService;
