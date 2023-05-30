import jwt from 'jsonwebtoken';
import config from '../config/index.js';

class JwtService {
  /**
   * Generates an access JWT with the given payload and options
   * @param {Object} payload - The data to include in the token
   * @param {jwt.SignOptions} [options] The options for signing the token.
   * @returns {string} The signed token
   */
  generateAccessToken(payload, options = {}) {
    // Check if the options parameter is an object
    if (typeof options !== 'object' || options instanceof Array) {
      throw new Error('Invalid options: expected an object');
    }

    // Set the default expiration time if not provided
    if (options.expiresIn === undefined) {
      options.expiresIn = parseInt(config.jwt.expireTime.access);
    }

    // Set the audience and issuer from the config
    options.audience = config.jwt.audience;
    options.issuer = config.jwt.issuer;

    // Sign and return the token using the secret key from the config
    return jwt.sign(payload, config.jwt.secret.access, options);
  }

  /**
   * Generates a refresh JWT with the given payload and options
   * @param {Object} payload - The data to include in the token
   * @param {jwt.SignOptions} [options] The options for signing the token.
   * @returns {string} The signed token
   */
  generateRefreshToken(payload, options = {}) {
    // Check if the options parameter is an object
    if (typeof options !== 'object' || options instanceof Array) {
      throw new Error('Invalid options: expected an object');
    }

    // Set the default access token expiration time if not provided
    if (options.expiresIn === undefined) {
      options.expiresIn = parseInt(config.jwt.expireTime.refresh);
    }

    // Set the audience and issuer from the config
    options.audience = config.jwt.audience;
    options.issuer = config.jwt.issuer;

    // Sign and return the token using the secret key from the config
    return jwt.sign(payload, config.jwt.secret.refresh, options);
  }
}

export default JwtService;
