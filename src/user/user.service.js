import bcrypt from 'bcryptjs';
import { Model } from 'objection';
import urlJoin from 'url-join';
import { v4 as uuidv4 } from 'uuid';
import AccountRepository from '../account/account.repository.js';
import config from '../config/index.js';
import ConflictError from '../errors/conflict.error.js';
import NotFoundError from '../errors/notFound.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import ValidationError from '../errors/validation.error.js';
import ApiResponse from '../utils/apiResponse.utils.js';
import JwtService from '../utils/jwt-service.utils.js';
import UserRepository from './user.repository.js';

class UserService {
  #accountRepository;
  #userRepository;
  #jwtService;

  /**
   * A service that provides user-related business logic, such as creating, updating, deleting, and retrieving users and their accounts
   * @class UserService
   * @description A service that provides user-related operations
   * @param {AccountRepository} accountRepository - An instance of the AccountRepository class that handles account data access and manipulation.
   * @param {UserRepository} userRepository - An instance of the UserRepository class that handles user data access and manipulation.
   * @param {JwtService} jwtService - An instance of the JwtService class
   */
  constructor(accountRepository, userRepository, jwtService) {
    this.#accountRepository = accountRepository;
    this.#userRepository = userRepository;
    this.#jwtService = jwtService;
  }

  /**
   * Create a new user and account.
   * This function is used to sign up the user to the service.
   * @param {SignUpDto} signUpDto - An object with user and account data
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async signUp(signUpDto) {
    const { user, account } = signUpDto;

    user.id = uuidv4();
    account.id = uuidv4();
    account.user_id = signUpDto.user.id;

    // Hashing the password property this is to ensure that passwords are stored securely in the database.
    user.password = await bcrypt.hash(
      user.password,
      parseInt(config.saltRounds),
    );

    // Hashing the pin property this is to ensure that pins are stored securely in the database.
    account.pin = await bcrypt.hash(account.pin, parseInt(config.saltRounds));

    const result = await Model.transaction(async (trx) => {
      const [newUser] = await Promise.all([
        this.#userRepository.insert(user, trx),
        this.#accountRepository.insert(account, trx),
      ]);

      return newUser.toObject();
    });

    // Generate a verification token using jsonwebtoken
    const token = this.#jwtService.generateToken(
      { id: result.id },
      config.jwt.secret.signUP,
      { expiresIn: config.jwt.expireTime.signUp },
    );

    // Generate a verification url using url-join
    const verification_url = urlJoin(
      config.api.baseUrl,
      config.api.version,
      '/users/verify',
      result.id,
      token,
    );

    // Send a verification email to the user using nodemailer
    // await this.#emailService.sendVerificationEmail(result.email, verification_url);

    return new ApiResponse(
      'You have successfully signed up for the service.',
      result,
      {
        verification_url,
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
   * @returns {Promise<ApiResponse>}
   */
  async create(createUserDto) {
    createUserDto.id = uuidv4();
    const { password } = createUserDto;

    // Hashing the password property this is to ensure that passwords are stored securely in the database.
    createUserDto.password = await bcrypt.hash(
      password,
      parseInt(config.saltRounds),
    );

    const newUser = await this.#userRepository.insert(createUserDto);

    return new ApiResponse('User Successfully Created', newUser.toObject());
  }

  /**
   * This function is used to find users that match the filter if any.
   * @param {UserFilter} [filter] - An object with user profile fields to filter by (optional).
   * @returns {Promise<ApiResponse>}
   */
  async get(filter) {
    const foundUsers = await this.#userRepository.find(filter);

    if (foundUsers.length === 0) throw new NotFoundError('No Users Found');

    // Format the number of found users with commas
    const count = foundUsers.length;
    const formattedCount = Intl.NumberFormat('en-US').format(count);

    return new ApiResponse(
      `Found ${formattedCount} user(s) matching the filter.`,
      foundUsers,
      { count },
    );
  }

  /**
   * Retrieves the user by ID
   * @param {string} userId - The ID to be retrieved
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async show(userId) {
    const foundUser = await this.#userRepository.findById(userId);
    if (!foundUser) throw new NotFoundError('User Not Found');

    return new ApiResponse('User Found', foundUser.toObject());
  }

  /**
   * Updates the user information by ID
   * @param {string} userId - The ID of the user to be updated.
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async update(userId, updateUserDto) {
    await this.#userRepository.update(userId, updateUserDto);

    return new ApiResponse('User Updated');
  }

  /**
   * Deletes a user by ID
   * @param {string} userId - The ID of the user to be deleted
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async erase(userId) {
    await this.#userRepository.remove(userId);

    return new ApiResponse('User Deleted');
  }

  /**
   *
   * @param {string} userId
   * @param {string} token
   * @returns
   */
  async verify(userId, token) {
    try {
      const decoded = this.#jwtService.verifyToken(
        token,
        config.jwt.secret.signUP,
      );

      if (decoded.id === userId) {
        const foundUser = await this.#userRepository.findById(userId);
        if (!foundUser) {
          throw new NotFoundError('User Not Found');
        }

        if (foundUser.isVerified) {
          throw new ConflictError('User Already Verified');
        }

        await foundUser.$query().patch({ isVerified: true });

        return new ApiResponse('User Verified Successfully');
      } else {
        throw new ValidationError('Invalid User ID or Token');
      }
    } catch (error) {
      throw new UnauthorizedError('Expired or Invalid Token');
    }
  }

  /**
   *
   * @param {string} userId
   * @param {UpdatePasswordDto} updatePasswordDto
   */
  async updatePassword(userId, updatePasswordDto) {
    const { old_password, new_password } = updatePasswordDto;

    const foundUser = await this.#userRepository.findById(userId);
    if (!foundUser) throw new NotFoundError('Operation failed. User not found');

    const isValid = foundUser.validatePassword(old_password);
    if (!isValid) throw new UnauthorizedError('Invalid Password');

    // Hashing the password property this is to ensure that passwords are stored securely in the database.
    const hashedPassword = bcrypt.hashSync(
      new_password,
      parseInt(config.saltRounds),
    );

    await foundUser.$query().patch({ password: hashedPassword });

    return new ApiResponse('Password Updated');
  }
}

export default UserService;
