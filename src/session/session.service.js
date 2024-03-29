import _ from 'lodash';
import urlJoin from 'url-join';
import config from '../config/index.js';
import ConflictError from '../errors/conflict.error.js';
import NotFoundError from '../errors/notFound.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import UserRepository from '../user/user.repository.js';
import ApiResponse from '../utils/apiResponse.utils.js';
import JwtService from '../utils/jwtService.utils.js';
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

  /**
   *
   * @param {LoginDto} loginDto
   * @returns {Promise<ApiResponse>}
   */
  async login(loginDto) {
    const { usernameOrEmail, password } = loginDto;

    const foundUser = await this.#userRepository.findByUsernameOrEmail(
      usernameOrEmail,
    );
    if (!foundUser) {
      throw new NotFoundError(
        'There is no account associated with this email or username. Please register to access our services.',
      );
    }

    if (!foundUser.is_verified) {
      const resend_verification_url = urlJoin(
        config.api.baseUrl,
        config.api.version,
        '/users/verification/resend',
        `?email=${foundUser.email}`,
      );

      throw new UnauthorizedError(
        'User has not been verified, please use the link to get a verification url.',
        { meta: resend_verification_url },
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

    const newSession = {
      user_id: foundUser.id,
      refresh_token: refreshToken,
    };

    // Saving the new session to database.
    await this.#sessionRepository.insert(newSession).catch(async (error) => {
      if (error instanceof ConflictError) {
        await this.#sessionRepository.updateByUserId(
          newSession.user_id,
          _.pick(newSession, 'refresh_token'),
        );
      }
    });

    /**
     * Capitalizing the first letter of the user first name
     */
    const firstName = foundUser.first_name
      .charAt(0)
      .toUpperCase()
      .concat(foundUser.first_name.slice(1));

    return new ApiResponse(`Welcome back ${firstName}!`, {
      id: foundUser.id,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async logout(userId) {
    const foundSession = await this.#sessionRepository.findByUserId(userId);

    if (foundSession) {
      await foundSession.$query().delete();
    }

    return new ApiResponse('Logged out');
  }
}

export default SessionService;
