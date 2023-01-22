const { Model } = require('objection');

class Account extends Model {
    static get tableName() {
        return 'accounts';
    }

    static get user_id() {
        return 'user_id';
    }

    static get balance() {
        return 'balance';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id'],
            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                balance: { type: 'integer' },
            },
        };
    }
}

module.exports = Account;
