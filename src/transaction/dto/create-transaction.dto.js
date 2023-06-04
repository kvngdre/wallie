import {
  TransactionPurpose,
  TransactionType,
} from '../jsdoc/transaction.types';

/**
 * @typedef {Object} CreateTransactionDto - A data transfer object for new transaction information.
 * @property {string} account_id - The unique identifier of the user account.
 * @property {string} [timestamp] - The date and time of the transaction.
 * @property {TransactionType} type - The type of transaction.
 * @property {TransactionPurpose} purpose - The purpose of the transaction.
 * @property {number} amount - The transaction amount.
 * @property {string} reference - The unique identifier for the transaction.
 * @property {string} [description] - The transaction description.
 * @property {number} balance_before - The balance before the transaction.
 * @property {number} balance_after - The balance after the transaction.
 */
