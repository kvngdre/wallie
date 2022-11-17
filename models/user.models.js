const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

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
                password: { type: 'string' }
            },
        };
    }
}

module.exports = User;
