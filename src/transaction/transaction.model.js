import { Model } from 'objection';
import NotFoundError from '../errors/notFound.error.js';
import Account from './account.model.js';

class Transaction extends Model {
  static get tableName() {
    return 'transactions';
  }

  static createNotFoundError(queryContext, message) {
    return new NotFoundError(message);
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
        'bal_before',
        'bal_after',
      ],
      properties: {
        id: { type: 'integer' },
        account_id: { type: 'integer' },
        type: { type: 'string' },
        purpose: { type: 'string' },
        amount: { type: 'number' },
        reference: { type: 'string' },
        description: { type: 'string' },
        bal_before: { type: 'number' },
        bal_after: { type: 'number' },
      },
    };
  }
}

export default Transaction;
