const User = require('../models/user.model');
const debug = require('debug')('app:userDao');
const logger = require('../utils/logger')('userDao.js');

class UserDao {
    async insert({ firstName, lastName, email, password }) {
        try {
            const newUser = await User.query()
                .insert({
                    firstName,
                    lastName,
                    email,
                    password,
                })
                .onConflict('email')
                .ignore();

            return newUser;
        } catch (exception) {
            debug(exception);
            logger.error({
                method: 'insert',
                message: exception.message,
                meta: exception.stack,
            });
            throw exception;
        }
    }

    async findAll() {
        try{
            const foundUsers = await User.query();
            return foundUsers
        }catch(exception) {
            debug(exception);
            logger.error({
                method: 'find_all',
                message: exception.message,
                meta: exception.stack,
            });
            throw exception;
        }
    }
}

module.exports = new UserDao();
