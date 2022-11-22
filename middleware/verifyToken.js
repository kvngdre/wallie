const config = require('config');
const debug = require('debug')('app:verifyToken');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader =
            req.header('Authorization') || req.header('authorization');
        if (!authHeader) return res.sendStatus(401);

        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer') return res.sendStatus(401);
        if (!token) return res.status(401).send('No token provided.');

        const decoded = jwt.verify(token, config.get('jwt.secret'));
        if (
            decoded.iss !== config.get('jwt.issuer') ||
            decoded.aud !== config.get('jwt.audience')
        ) {
            return res.status(401).send('Invalid token provided');
        }

        req.user = decoded;

        next();
    } catch (exception) {
        debug(exception.message);
        if (exception.name === 'TokenExpiredError')
            return res.status(403).send('Session expired.');

        return res.sendStatus(403);
    }
};
