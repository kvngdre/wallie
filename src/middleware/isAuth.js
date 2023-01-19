const config = require('config');
const debug = require('debug')('app:verifyToken');
const jwt = require('jsonwebtoken');
const ServerResponse = require('../utils/ServerResponse');

module.exports = (req, res, next) => {
    try {
        /**
         * We are assuming that the JWT will come in a header with the form
         *
         * Authorization: Bearer ${JWT}
         *
         */
        function getTokenFromHeader(req) {
            if (
                req.headers?.authorization.split(' ')[0] === 'Bearer' ||
                req.headers?.authorization.split(' ')[0] === 'Bearer'
            ) {
                return req.headers.authorization.split(' ')[1];
            }

            return null;
        }

        const token = getTokenFromHeader(req);
        const decoded = jwt.verify(token, config.get('jwt.secret'));
        if (
            decoded.iss !== config.get('jwt.issuer') ||
            decoded.aud !== config.get('jwt.audience')
        ) {
            throw new Error('Invalid token provided.');
        }

        req.user = decoded;

        next();
    } catch (exception) {
        debug(exception.message);
        return res.status(401).json(new ServerResponse(exception.message));
    }
};
