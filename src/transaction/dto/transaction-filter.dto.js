import { operatorMap } from '../../utils/common.utils';
import {
  TransactionPurpose,
  TransactionType,
} from '../jsdoc/transaction.types';

/**
 * Defines a type for transaction fields to filter by.
 * This object is used to specify which users to return from a query based on their properties.
 * The query will return transactions who match any of the given properties, using partial or exact matches as appropriate.
 * @typedef {Object} TransactionFilter - A data transfer object for transaction fields to filter by.
 * @property {string} [accountId] - The user id (exact match).
 * @property {keyof operatorMap} [operator] - The logical operator to apply.
 * @property {number} [value] - Value the logical operator would be applied to check if amount in range (partial match).
 * @property {TransactionType} [type] - The transaction type (exact match).
 * @property {TransactionPurpose} [purpose] - The transaction purpose (exact match).
 */
