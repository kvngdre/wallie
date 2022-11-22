const { Model } = require('objection');
const Account = require('./account.model');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    $beforeInsert() {
        this.password = bcrypt.hashSync(this.password, 12);
    }

    async $afterInsert() {
        delete this.password;
        await Account.query().insert({userId: this.id}); // create user account
    }

    $afterFind() {}

    static get firstName() {
        return 'firstName';
    }

    static get lastName() {
        return 'lastName';
    }

    static get email() {
        return 'email';
    }

    static get password() {
        return 'password';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['firstName', 'lastName', 'email', 'password'],
            properties: {
                id: { type: 'integer' },
                firstName: { type: 'string', minLength: 2, maxLength: 30 },
                lastName: { type: 'string', minLength: 2, maxLength: 30 },
                email: { type: 'string', maxLength: 50 },
                password: { type: 'string' },
            },
        };
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

    omitPassword() {
        delete this.password;
    }

    generateAccessToken() {
        return jwt.sign(
            {
                id: this.id,
            },
            config.get('jwt.secret'),
            {
                audience: config.get('jwt.audience'),
                expiresIn: parseInt(config.get('jwt.exp_time')),
                issuer: config.get('jwt.issuer'),
            }
        );
    }

    async isValidPassword(pwd) {
        return await bcrypt.compare(pwd, this.password);
    }
}

module.exports = User;
