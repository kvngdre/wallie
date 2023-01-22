const APIResponse = require('../utils/APIResponse');
const UserDAO = require('../daos/user.dao');
const NotFoundError = require('../errors/NotFoundError');

class UserService {
    async createUser(createUserDto) {
        const newUser = await UserDAO.insert(createUserDto);
        if (newUser.id == 0)
            throw new NotFoundError('Email is already in use.');

        return new APIResponse('User Created', newUser);
    }

    async getAllUsers() {
        const foundUsers = await UserDAO.findAll();
        if (foundUsers.length == 0) throw new NotFoundError('No users found');

        // Modify array inplace to delete user passwords.
        foundUsers.forEach((user) => user.omitPassword());

        const numberOfUsers = Intl.NumberFormat('en-US').format(
            foundUsers.length
        );
        return new APIResponse(`${numberOfUsers} users found`, foundUsers);
    }

    async getUser(userId) {
        const foundUser = await UserDAO.findOne(userId);
        if (!foundUser) throw new NotFoundError('User not found');

        foundUser.omitPassword();
        return new APIResponse('User found', foundUser);
    }

    async updateUser(userId, updateUserDto) {
        const updatedUser = await UserDAO.update(userId, updateUserDto);
        if (!updatedUser) throw new NotFoundError('User not found');

        updatedUser.omitPassword();
        return new APIResponse('User updated', updatedUser);
    }

    async deleteUser(userId) {
        const deletedUser = await UserDAO.delete(userId);
        if (!deletedUser) throw new NotFoundError('User not found');

        return new APIResponse('User deleted');
    }
}

module.exports = new UserService();
