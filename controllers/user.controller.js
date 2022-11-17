const debug = require('debug')('app:userCtrl');
const User = require('../models/user.models');

class UserController {
    mapToDataModel(data) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        };
    }

    async createUser(userDTO) {
        try {
            const newUser = await User.query().insert(
                this.mapToDataModel(userDTO)    
            );
            return {
                success: true,
                message: 'User created',
                data: newUser,
            };
        } catch (exception) {
            debug(exception);
            return exception;
        }
    }
}

module.exports = new UserController();
