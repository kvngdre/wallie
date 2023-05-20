const config = require('../config');
const jwt = require('jsonwebtoken');
const UnauthorizedException = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  try {
    /**
     * We are assuming that the JWT will come in a header with the form
     *
     * Authorization: Bearer ${JWT}
     *
     */
    function getTokenFromHeader(req) {
      /**
       * @TODO Edge and Internet Explorer do some weird things with the headers
       * So I believe that this should handle more 'edge' cases ;)
       */
      if (
        req.headers?.authorization?.split(' ')[0] === 'Bearer' ||
        req.headers?.authorization?.split(' ')[0] === 'Token'
      ) {
        return req.headers.authorization.split(' ')[1];
      }

      return null;
    }

    const token = getTokenFromHeader(req);
    const decoded = jwt.verify(token, config.jwt.secret);

    if (
      decoded.iss !== config.jwt.issuer ||
      decoded.aud !== config.jwt.audience
    ) {
      throw new UnauthorizedException('Invalid token provided.');
    }

    req.currentUser = decoded;

    next();
  } catch (exception) {
    throw new UnauthorizedException(exception.message);
  }
};
