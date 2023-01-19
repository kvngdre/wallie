const userDao = require('../DAOs/user.dao');
const debug = require('debug')('app:userService');
const logger = require('../utils/logger')('userService.js');
const ServerResponse = require('../utils/ServerResponse');

class UserService {
    async createUser(createUserDto) {
        const newUser = await userDao.insert(createUserDto);
        if (newUser.id == 0)
            return new ServerResponse("'Email' already in use.", 409);

        return new ServerResponse('User Created', 201, newUser);
    }

    async getAllUsers() {
        try {
            const foundUsers = await userDao.findAll();

            const numberOfUsers = Intl.NumberFormat('en-US').format(foundUsers.length);
            if (numberOfUsers == 0)
                return new ServerResponse('No users found', 404);

            // Modify array inplace to delete user passwords.
            foundUsers.forEach((user) => user.omitPassword());
            

            return new ServerResponse(`${numberOfUsers} users found`, 200, foundUsers);
        } catch (exception) {
            debug(exception.message);
            logger.error({
                method: 'get_all_users',
                message: exception.message,
                meta: exception.stack,
            });
            return ServerResponse._500;
        }
    }
}

module.exports = new UserService();
