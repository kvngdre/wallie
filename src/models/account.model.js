const { Model } = require('objection');

class Account extends Model {
    static get tableName() {
        return 'accounts';
    }

    static get userId() {
        return 'userId';
    }

    static get balance() {
        return 'balance';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId'],
            properties: {
                id: { type: 'integer' },
                userId: { type: 'integer' },
                balance: { type: 'integer' },
            },
        };
    }
}

module.exports = Account;
