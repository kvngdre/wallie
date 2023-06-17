import config from '../config/index.js';
import NotFoundError from '../errors/notFound.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import UserRepository from '../user/user.repository.js';
import JwtService from '../utils/jwtService.utils.js';

const jwtService = new JwtService();
const userRepository = new UserRepository();

/**
 *
 * @param {CustomRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default async function verifyToken(req, res, next) {
  try {
    /**
     * Extracts the JWT from the Authorization header of the request.
     * The header should have the form Authorization: Bearer ${JWT}
     * @param {import('express').Request} req - The express request object.
     * @returns {(string|null)} The JWT if present and valid.
     * @throws {UnauthorizedError} If the header is missing or has an invalid format.
     */
    function getTokenFromHeader(req) {
      // Check if the header exists
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedError('No token provided.');
      }

      // Check if the header has the correct format
      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedError('Invalid token provided.');
      }

      return token;
    }

    const token = getTokenFromHeader(req);
    const decoded = jwtService.verifyToken(token, config.jwt.secret.access);

    if (
      decoded.iss !== config.jwt.issuer ||
      decoded.aud !== config.jwt.audience
    ) {
      throw new UnauthorizedError('Invalid token provided.');
    }

    const foundUser = await userRepository.findById(decoded.id);
    if (!foundUser) {
      throw new NotFoundError('User Not Found');
    }

    req.currentUser = foundUser.toObject();

    next();
  } catch (exception) {
    throw new UnauthorizedError(exception.message);
  }
}
