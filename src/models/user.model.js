const { Model } = require('objection');
const Account = require('./account.model');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const NotFoundException = require('../errors/NotFoundError');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    $beforeInsert() {
        // Hash user password before insert.
        this.password = bcrypt.hashSync(this.password, 10);
    }

    static createNotFoundError(queryContext, message) {
        return new NotFoundException(message);
    }

    static get relationMappings() {
        return {
            account: {
                relation: Model.HasOneRelation,
                modelClass: Account,
                join: {
                    from: 'users.id',
                    to: 'accounts.user_id',
                },
            },
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['first_name', 'last_name', 'email', 'password'],
            properties: {
                id: { type: 'integer' },
                first_name: { type: 'string', minLength: 2, maxLength: 30 },
                last_name: { type: 'string', minLength: 2, maxLength: 30 },
                email: { type: 'string', maxLength: 255 },
                password: { type: 'string' },
                role: { type: 'string', maxLength: 2 },
            },
        };
    }

    omitPassword() {
        delete this.password;
    }

    comparePasswords = (pwd) => {
        return bcrypt.compareSync(pwd, this.password);
    }

    generateAccessToken() {
        return jwt.sign(
            { id: this.id, role: this.role },
            config.get('jwt.secret'),
            {
                audience: config.get('jwt.audience'),
                expiresIn: parseInt(config.get('jwt.exp_time')),
                issuer: config.get('jwt.issuer'),
            }
        );
    }
}

module.exports = User;
