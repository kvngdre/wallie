const { Model } = require('objection');
const User = require('./user.model');

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

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'accounts.userId',
                    to: 'users.id',
                },
            },
        };
    }
}

module.exports = Account;
