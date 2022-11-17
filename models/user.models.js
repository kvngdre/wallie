const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get firstName() {
        return 'first_name';
    }

    static get lastName() {
        return 'last_name';
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
            required: ['first_name', 'last_name', 'email', 'password'],
            properties: {
                id: { type: 'integer' },
                first_name: { type: 'string', minLength: 2, maxLength: 30 },
                last_name: { type: 'string', minLength: 2, maxLength: 30 },
                email: { type: 'string', maxLength: 50 },
                password: { type: 'string' }
            },
        };
    }
}

module.exports = User;
