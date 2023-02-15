const logger = require('../loaders/logger');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UserDAO = require('../daos/user.dao');

class AuthService {
    static async signIn(loginDto) {
        const { email, password } = loginDto;

        const foundUser = await UserDAO.findOne(
            { email },
            'User not registered'
        );

        const isMatch = foundUser.comparePasswords(password);
        if (!isMatch)
            throw new UnauthorizedError('Incorrect email or password');

        logger.silly('Password is valid');
        foundUser.omitPassword();

        logger.silly('Generating JWT');
        const token = foundUser.generateAccessToken();

        return { ...foundUser, token };
    }
}

module.exports = AuthService;
