const { Model } = require('objection');
const Account = require('./account.model');

class Transaction extends Model {
    static get tableName() {
        return 'transactions';
    }

    static get accountId() {
        return 'accountId';
    }

    static get txnType() {
        return 'txnType';
    }

    static get purpose() {
        return 'purpose';
    }

    static get amount() {
        return 'amount';
    }

    static get reference() {
        return 'reference';
    }

    static get balanceBefore() {
        return 'balanceBefore';
    }

    static get balanceAfter() {
        return 'balanceAfter';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [
                'accountId',
                'txnType',
                'purpose',
                'amount',
                'reference',
                'balanceBefore',
                'balanceAfter',
            ],
            properties: {
                id: { type: 'integer' },
                accountId: { type: 'integer' },
                txnType: { type: 'string' },
                purpose: { type: 'string' },
                amount: { type: 'integer' },
                reference: { type: 'string' },
                balanceBefore: { type: 'integer' },
                balanceAfter: { type: 'integer' },
            },
        };
    }

    static get relationMappings() {
        return {
            account: {
                relation: Model.BelongsToOneRelation,
                modelClass: Account,
                join: {
                    from: 'transactions.accountId',
                    to: 'accounts.id',
                },
            },
        };
    }
}

module.exports = Transaction;
