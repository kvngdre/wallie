import { Model } from 'objection';
import Account from '../account/account.model.js';

class Transaction extends Model {
  static get tableName() {
    return 'transactions';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'transactions.account_id',
          to: 'accounts.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'account_id',
        'type',
        'purpose',
        'amount',
        'reference',
        'balance_before',
        'balance_after',
      ],
      properties: {
        id: { type: 'integer' },
        account_id: { type: 'string' },
        type: { type: 'string' },
        purpose: { type: 'string' },
        amount: { type: 'number' },
        reference: { type: 'string' },
        description: { type: 'string' },
        balance_before: { type: 'number' },
        balance_after: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }
}

export default Transaction;
