import { Model } from 'objection';
import Account from '../account/account.model.js';
import { operatorMap } from '../utils/common.utils.js';
import {
  TransactionPurpose,
  TransactionType,
} from './jsdoc/transaction.types.js';

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

  static modifiers = {
    /**
     * Filters transactions by type if type is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {TransactionType} type - The type to filter by.
     */
    filterByType(query, type) {
      if (type) {
        query.where({ type });
      }
    },

    /**
     * Filters transactions by purpose if purpose is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {TransactionPurpose} purpose - The purpose to filter by.
     */
    filterByPurpose(query, purpose) {
      if (purpose) {
        query.andWhere({ purpose });
      }
    },

    /**
     * Filters transactions by account_id if account_id is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {string} account_id - The account_id to filter by.
     */
    filterByAccountId(query, account_id) {
      if (account_id) {
        query.andWhere({ account_id });
      }
    },

    /**
     * Filters transactions by amount if operator and value is not undefined.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {AccountFilter} filter - The account filter object to filter by.
     */
    filterByAmount(query, { operator, value }) {
      if (operator !== undefined && value !== undefined) {
        query.andWhere('amount', operatorMap[operator], value);
      }
    },
  };

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
        timestamp: { type: 'string' },
        type: { type: 'string' },
        purpose: { type: 'string' },
        amount: { type: 'number' },
        reference: { type: 'string' },
        description: { type: 'string' },
        destination_account: { type: 'string' },
        balance_before: { type: 'number' },
        balance_after: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }
}

export default Transaction;
