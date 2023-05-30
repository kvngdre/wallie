import { NotFoundError } from 'objection';
import UnauthorizedError from '../errors/unauthorized.error.js';
import UserRepository from '../user/user.repository.js';
import ApiResponse from '../utils/apiResponse.utils.js';
import JwtService from '../utils/jwt-service.utils.js';
import SessionRepository from './session.repository.js';

class SessionService {
  #jwtService;
  #sessionRepository;
  #userRepository;

  /**
   * @class SessionService
   * @description A service that provides session-related operations
   * @param {JwtService} jwtService - A service that handles JSON Web Token generation and verification
   * @param {SessionRepository} sessionRepository - A repository that handles session data access
   * @param {UserRepository} userRepository - A repository that handles user data access
   */
  constructor(jwtService, sessionRepository, userRepository) {
    this.#jwtService = jwtService;
    this.#sessionRepository = sessionRepository;
    this.#userRepository = userRepository;
  }

  async login(loginDto) {
    const { usernameOrEmail, password } = loginDto;

    const foundUser = await this.#userRepository.findByUsernameOrEmail(
      usernameOrEmail,
    );

    if (!foundUser) {
      throw new NotFoundError(
        'There is no account associated with that email or username. Please register to access our services.',
      );
    }

    // Check if the password matches using a method on the user model
    const isValid = foundUser.validatePassword(password);

    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const accessToken = this.#jwtService.generateAccessToken({
      id: foundUser.id,
    });
    const refreshToken = this.#jwtService.generateRefreshToken({
      id: foundUser.id,
    });

    // Saving the new session in the database.
    await this.#sessionRepository.insert({
      user_id: foundUser.id,
      refresh_token: refreshToken,
    });

    return new ApiResponse('Logged in', {
      access_token: accessToken,
      refreshToken: refresh_token,
    });
  }
}

export default SessionService;
