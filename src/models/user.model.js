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
        // Hash user password before insert.
        this.password = bcrypt.hashSync(this.password, 12);
    }

    async $afterInsert() {
        delete this.password;

        // Create an account for the new user.
        await Account.query()
            .insert({ user_id: this.id })
            .onConflict('user_id')
            .ignore();
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['first_name', 'last_name', 'email', 'password'],
            properties: {
                id: { type: 'integer' },
                first_name: { type: 'string', minLength: 2, maxLength: 30 },
                last_name: { type: 'string', minLength: 2, maxLength: 30 },
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

    async comparePasswords(pwd) {
        return await bcrypt.compare(pwd, this.password);
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
}

module.exports = User;
