const { admin, user } = require('../utils/userRoles');
const events = require('../pubsub/events');
const pubsub = require('../pubsub/PubSub');
const UserDAO = require('../daos/user.dao');
const ConflictException = require('../errors/ConflictError');
const User = require('../models/user.model');

class UserService {
    async createUser(createUserDto) {
        // Assigning user role
        try {
            await this.getUsers({ role: admin });
            createUserDto.role = user;
        } catch (e) {
            createUserDto.role = admin;
        }

        const newUser = await UserDAO.insert(createUserDto);
        newUser.omitPassword();

        // Emitting user sign up event.
        await pubsub.publish(events.user.signUp, newUser);

        return newUser;
    }

    async getUsers(queryObj) {
        const foundUsers = await UserDAO.findAll(queryObj);
        const count = Intl.NumberFormat('en-US').format(foundUsers.length);

        // Modify array inplace to delete user passwords.
        foundUsers.forEach((user) => user.omitPassword());

        return { count, foundUsers };
    }

    async getUser(userId) {
        const foundUser = await UserDAO.findById(userId);
        foundUser.omitPassword();

        return foundUser;
    }

    async updateUser(currentUser, updateUserDto) {
        const updatedUser = await UserDAO.update(currentUser, updateUserDto);
        updatedUser.omitPassword();

        return updatedUser;
    }

    async deleteUser(currentUser, userId) {
        if (currentUser.id == userId) {
            const [{ count }] = await User.query()
                .where({ role: user })
                .count({ count: 'id' });

            if (count > 0)
                throw new ConflictException(
                    'Conflict! Admin user must be the only user.'
                );
        }
        // @TODO: invalidate access token...
        // possible solution is to implement refresh tokens with short lived access tokens.
        return await UserDAO.delete(userId);
    }
}

module.exports = new UserService();
