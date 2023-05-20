import UnauthorizedError from '../errors/unauthorized.error.js';
import UserRepository from '../user/user.repository.js';
import Logger from '../utils/logger.utils.js';

const logger = new Logger();

class AuthService {
  async signIn(loginDto) {
    const { email, password } = loginDto;

    const foundUser = await UserRepository.findOne(
      { email },
      'User not registered',
    );

    const isMatch = foundUser.comparePasswords(password);
    if (!isMatch) throw new UnauthorizedError('Incorrect email or password');

    logger.silly('Password is valid');
    foundUser.omitPassword();

    logger.silly('Generating JWT');
    const token = foundUser.generateAccessToken();

    return { ...foundUser, token };
  }
}

export default AuthService;
