import { NotFoundError } from 'objection';
import UnauthorizedError from '../errors/unauthorized.error.js';
import UserRepository from '../user/user.repository.js';
import SessionRepository from './session.repository.js';

class SessionService {
  #sessionRepository;
  #userRepository;

  /**
   * @class SessionService
   * @param {SessionRepository} sessionRepository
   * @param {UserRepository} userRepository
   */
  constructor(sessionRepository, userRepository) {
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

    const isMatch = foundUser.comparePasswords(password);
    if (!isMatch) throw new UnauthorizedError('Incorrect email or password');

    logger.silly('Password is valid');
    foundUser.omitPassword();

    logger.silly('Generating JWT');
    const token = foundUser.generateAccessToken();

    return { ...foundUser, token };
  }
}

export default SessionService;
